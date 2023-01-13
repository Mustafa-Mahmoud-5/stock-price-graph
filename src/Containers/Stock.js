import React, { Component, Fragment } from 'react';
import StockChart from "../Components/StockChart";
import Loader from '../Components/Loader';
import axios from 'axios';
import fetchData from '../Apis/Fetch';
import { TIME_SERIES_INTRADAY, TIME_SERIES_DAILY, TIME_SERIES_WEEKLY, SYMBOL_SEARCH, GLOBAL_QUOTE } from '../Apis/Params';
import "./Stock.scss";
// gonna save the data their instead of making up a request for each view type
let interday = null;
let daily = null;
let weekly = null;
let compName = null;
export class Stock extends Component {
	state = {
		loading: false,
		chartData: null,
		globalData: null,
		companyName: "",
		activeOption: null
	};

	searchHandler = (e) => {
		this.setState({[ e.target.name ]: e.target.value});
	};

	getSymbol = async () => {
		try {
			// get company symbol to search with it in the api
			const res = await fetchData(SYMBOL_SEARCH(this.state.companyName))
			const matches = res.data.bestMatches;
			if(matches.length === 0) throw new Error("No Results were found!!");
			const symbol = res.data.bestMatches[0]["1. symbol"];
			compName = res.data.bestMatches[0]["2. name"];

			console.log("SYMBOL: ", res.data.bestMatches[0]["1. symbol"])
			return symbol;
		} catch (error) {
			alert(error.response.data.message);
		}
	}

	initiateData = async (symbol) => {
		//fetch data once, store it in interday, daily, weekly so we get back to them on type change
		try {
			const quoteData = await fetchData(GLOBAL_QUOTE(symbol));
	
			const interdayData = await fetchData(TIME_SERIES_INTRADAY(symbol));
			interday = this.mapData(interdayData.data["Time Series (5min)"]);

			const dailyData = await fetchData(TIME_SERIES_DAILY(symbol));
			daily = this.mapData(dailyData.data["Time Series (Daily)"],90);

			const weeklyData = await fetchData(TIME_SERIES_WEEKLY(symbol));
			weekly = this.mapData(weeklyData.data["Weekly Time Series"], 240);

			this.setState({chartData: interday, globalData: quoteData.data["Global Quote"]})
		} catch (error) {
			alert(error.response.data.message);
		}
	}

	sumbitHandler = async (e) => {
		try {
			e.preventDefault()
			this.setState({loading: true})
			const symbol = await this.getSymbol();
			await this.initiateData(symbol);
			this.setState({loading: false});
			console.log("Interday:", interday);
			console.log("Daily:", daily);
			console.log("Weekly:", weekly)
			
		} catch (error) {
			this.setState({loading: false})
			alert(error.response.data.message);
		}
	}

	mapData = (obj,n) => {
		return Object.keys(obj).slice(0, n).map(key => [this.formatDate(key), Number(obj[key]["4. close"])]);
	}

	typeHandler = (e) => {
		let [func, count] = e.target.value.split('-')		
		
		if(func == "interday") {
			this.setState({chartData: interday});
			return;
		}
		
		let data;
		if(func === "daily") {
			data = daily.slice(0, count);
		} else if(func == "weekly") {
			data = weekly.slice(0, count);
		}

		this.setState({chartData: data});
	}

	 formatDate = (date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

	render() {
		let globData, change, changePercentage, price;

		if(this.state.globalData) {
			globData = this.state.globalData;
			change = globData["09. change"];
			changePercentage = globData["10. change percent"]
			price = `$${globData["05. price"]}`;
		}

		return (
			<section className="container">
				<div className='stock-app'>
					<form onSubmit={this.sumbitHandler}>
						<input id='inp-style' type='text' name='companyName' value={this.state.companyName} onChange={this.searchHandler} required= {true} placeholder = "press enter to search"/>
					</form>

					{this.state.loading ? <Loader /> :
				 <Fragment>
						{this.state.chartData &&
						<Fragment>
						<div className='global-data'>
							<p className='text-lg'>{compName}</p>
							<p className='text-lg'>{price}</p>
							<p>{`Change(${change}%)`}</p>
						</div>
							<div className='chart-section'>
								<StockChart chartData = {this.state.chartData}/>
							</div>
							<div className='options'>
								<div>
									<button className='type' value={"interday"} onClick = {this.typeHandler}>1D</button>
									<button className='type' value={"daily-7"} onClick = {this.typeHandler}>1W</button>
									<button className='type' value={"daily-30"} onClick = {this.typeHandler}>1M</button>
									<button className='type' value={"daily-90"} onClick = {this.typeHandler}>3M</button>
									<button className='type' value={"weekly-48"} onClick = {this.typeHandler}>1Y</button>
									<button className='type' value={"weekly-240"} onClick = {this.typeHandler}>5Y</button>
								</div>
							</div>
						</Fragment>}
					</Fragment>}


				</div>

			</section>
		);
	}
}

export default Stock;
