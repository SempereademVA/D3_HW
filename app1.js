// First set up the chart
var svgWidth = 760  ;
var svgHeight = 400;

var margin = {top: 20,
            right: 0,
            bottom: 80,
            left:85};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins
var svg = d3
    .select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append and SVG group
var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Retrieve data from the CSV file
d3.csv("Data.csv", function(error, csvdata) {

    for (var i = 0; i < csvdata.length; i++){
        // console.log(data.abbr);
        console.log(csvdata[i].Locationabbr)
    }
    if (error) throw error;

    csvdata.forEach(function(d) {
        d.Percent_Poverty = +d.Percent_Poverty;
        d.Percent_Diabetes = +d.Percent_Diabetes;        
    });

    // Create scale functions
    var yLinearScale = d3.scaleLinear()
        .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
        .range([0, width]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);

    var leftAxis = d3.axisLeft(yLinearScale);

    function findMinAndMax(dataColumnX) {
        xMin = d3.min(csvdata, function(d) {
            return +d[dataColumnX] * 0.8;
        });

        xMax =  d3.max(csvdata, function(d) {
            return +d[dataColumnX] * 1.1;
        });

        yMax = d3.max(csvdata, function(d) {
            return +d.Percent_Diabetes * 1.1;
        });
    }
    // Default x-axis
    var currentAxisLabelX = "Percent_Poverty";

    // Call findMinAndMax() with 'poverty' as default
    findMinAndMax(currentAxisLabelX);

    // Set the domain of an axis to extend from the min to the max value of the data column
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([0, yMax]);

    // Create tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .html(function(d) {
            var state = d.Locationabbr;
            var poverty = +d.Percent_Poverty;
            var diabetes = +d.Percent_Diabetes;
            return (d.state + "<br> In Poverty: " + poverty + "%<br> Have Diabetes: " + diabetes + "%");
        });

    chart.call(toolTip);





    // Append an SVG group for the x-axis, then display the x-axis
    chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    // The class name assigned here will be used for transition effects
    .attr("class", "x-axis")
    .call(bottomAxis);

    // Append a group for y-axis, then display it
    chart
        .append("g")
        .call(leftAxis);

    // Append y-axis label
    chart    
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "axis-text")

    .text("Have Diabetes(%)");

    // Append x-axis labels
    chart
    .append("text")
    .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 20) + ")")

    .text("In Poverty (%)");

    var circles = chart.selectAll(".state")
        .data(csvdata)
        .enter()

    circles
        .append("circle")
        .attr("class", "state")  
        .attr("cx", function(d, index) {
            return xLinearScale(+d[currentAxisLabelX]);
        })
        .attr("cy", function(d, index) {
            return yLinearScale(d.Percent_Diabetes);
        })
        .attr("r", "15")
        .style("fill","dodgerblue") 
        .style("opacity", .2)
        .style("stroke-width", ".2");
    
    circles
        .append("text")
        .attr("x", function(d, index) {
            return xLinearScale(+d[currentAxisLabelX]- 0.08);
        })
        .attr("y", function(d, index) {
            return yLinearScale(d.Percent_Diabetes - 0.2);
        })
        .text(function(d){
            return d.Locationabbr;
        })
        .attr("class", "circleText")
        // Add listeners on text
        .on("mouseover", function(d) {
          toolTip.show(d);
        })
        // onmouseout event
        .on("mouseout", function(d, index) {
          toolTip.hide(d);
        });
        
    });
