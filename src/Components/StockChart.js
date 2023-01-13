import React from "react";
import { Chart } from "react-google-charts";

const data = [
  [
    { type: "string", label: "Day" },
    "Stock Price",
  ],
  [new Date("2019-12-06"), 5.7],
  [new Date("2019-12-07"), 7]
];

const options = {
  // chart: {
  //   title: "Stock Chart",
  // },
  width: "100%",
  height: "100%",
  series: {
    // Gives each series an axis name that matches the Y-axis below.
    0: { axis: "Temps" },
    1: { axis: "Daylight" },
  },
  axes: {
    // Adds labels to each axis; they don't have to match the axis names.
    y: {
      Temps: { label: "Price" },
      Daylight: { label: "Daylight" },
    },
  },
};

export default function App(props) {
  let chartData = props.chartData;
  if(chartData) {
    chartData[0] = data[0];
  } else {
    chartData = data
  }

  return (
    <Chart
      chartType="Line"
      width="100%"
      height="400px"
      data={chartData}
      options={options}
    />
  );
}
