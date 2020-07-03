import * as d3 from "d3";
import { mainData, colorsData } from "./data/data";
const width = 900;

const constructPercentStack = (selector) => {
  const mainSvg = d3
    .select(selector)
    .append("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("viewBox", "0 0 913 100");
  // Transpose the data into layers
  const dataset = d3.stack().keys(["a", "b", "c"]).order(d3.stackOrderNone);
  const scaler = d3.scaleLinear().domain([0, 100]).range([0, width]);
  const groups = mainSvg
    .selectAll("g.single-bar")
    .data(dataset(mainData))
    .enter()
    .append("g")
    .attr("class", "single-bar")
    .style("fill", function (d, i) {
      return colorsData[i];
    });

  const rect = groups
    .selectAll("rect")
    .data(function (d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("width", 0)
    .attr("y", function (d) {
      return 20;
    })
    .attr("height", function (d) {
      return 60;
    })
    .on("mouseover", function () {
      tooltip.style("display", null);
    })
    .on("mouseout", function () {
      tooltip.style("display", "none");
    })
    .on("mousemove", function (d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr(
        "transform",
        "translate(" + xPosition + "," + yPosition + ")"
      );
      tooltip.select("text").text(`${d[1] - d[0]} %`);
    })
    .transition()
    .duration(1000)
    .attr("x", function (d) {
      console.log("x", scaler(d[0]));
      return scaler(d[0]);
    })
    .attr("width", function (d) {
      console.log("width", scaler(d[1] - d[0]));
      return scaler(d[1] - d[0]);
    });

  // Prep the tooltip bits, initial display is hidden
  var tooltip = mainSvg
    .append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  tooltip
    .append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0.5);

  tooltip
    .append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("fill", "#484848")
    .attr("font-size", "12px");
};

constructPercentStack("#container");
