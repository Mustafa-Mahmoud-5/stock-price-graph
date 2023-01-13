import axios from 'axios';
const fetchData  = (params) => {
	const headers = {
    'X-RapidAPI-Key': '7bc106f21cmsh326da27a670d09dp15f81ejsn2c58228c0035',
    'X-RapidAPI-Host': 'alpha-vantage.p.rapidapi.com'
  };

  return axios.get('https://alpha-vantage.p.rapidapi.com/query', { params, headers });
}

export default fetchData;