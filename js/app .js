// Set SVG parameters
var svgWidth = 960;
var svgHeight = 500;

// Margin for SVG graphics
var margin = {
  top: 20,
  bottom: 80,
  left: 100,
  right: 40
};

var width = svgWidth - margin.left - margin.right;    
var height = svgHeight - margin.top - margin.bottom;  

// Create the SVG canvas container inside <div id="scatter"> in index.html
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("fill", "red")
  .attr("class", "chart");

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// from Inspect, SVG tag got created  
{/* <div id="scatter">
   <svg width="960" height="500" class="chart"><g transform="translate(100, 20)"></g></svg></div> */}

//Import data
d3.csv("assets/data/data.csv").then(function (healthData) {
  console.log(healthData);

  healthData.forEach(function (data) {
    data.state = data.state;
    data.abbr = data.abbr;
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

  // x-axis scale & y-axis scale
  var xLinearScale = d3.scaleLinear()
    .domain([20, d3.max(healthData, d => d.obesity + 1)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([5, d3.max(healthData, d => d.poverty + 5)])
    .range([height, 0]);

  // create axis
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  //Append to chartGroup
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);
  

  // axis labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 60)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "aText")
    .text("In Poverty (%)");

  console.log("y axis label")
  console.log((0 - (height / 2)), (0 - margin.left + 60))

  // x-axis labels  430 450
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "aText")
    .text("Obesity (%)");

  console.log("x axis label")
  console.log((width / 2), (height + margin.top + 30))
  
  // create circles for scatter plot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "10")
    .attr("fill", "blue")   // remove fill: from .stateCircle in css/d3Style.css 
    .attr("class", "stateCircle");
  

  // abbr in circles
  var stateAbbr = chartGroup.selectAll(null)
    .data(healthData)
    .enter().append("text");

  stateAbbr
    .attr("x", function (d) {
      return xLinearScale(d.obesity);
    })
    .attr("y", function (d) {
      return yLinearScale(d.poverty) + 2
    })
    .text(function (d) {
      return d.abbr;
    })
    .attr("class", "stateText")
    .attr("font-size", "9px");
  

  // toolTip
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([30, 60])
    .html(function (d) {
      var theState = "<div>" + d.state + "</div>";
      var theX = "<div>Obesity: " + d.obesity + "%</div>";
      var theY = "<div>Poverty: " + d.poverty + "%</div>";
      // return (`${d.state}`);
      return theState + theX + theY;
    });

  chartGroup.call(toolTip);

  circlesGroup.on("mouseover", function (healthdata) {
    toolTip.show(healthdata, this);
  })
    //mouseout
    .on("mouseout", function (healthdata) {
      toolTip.hide(healthdata);
    });

}).catch(function (error) {
  console.log(error);
});