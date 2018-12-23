/*
*    main.js
*    Mastering Data Visualization with D3.js
*    CoinStats
*/

var margin = { left:80, right:100, top:50, bottom:100 },
    height = 500 - margin.top - margin.bottom, 
    width = 800 - margin.left - margin.right;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + 
        ", " + margin.top + ")");

var value = 'price_usd';
var currentData;
var allData;
var startYear = 2013;
var endYear = 2017;

// Time parser for x-scale
var parseTime = d3.timeParse("%d/%m/%Y");
// For tooltip
var bisectDate = d3.bisector(function(d) { return d.date; }).left;

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Axis generators
var xAxisCall = d3.axisBottom()
    .ticks(4);
var yAxisCall = d3.axisLeft();

// Axis groups
var xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");
var yAxis = g.append("g")
    .attr("class", "y axis")
    
// Y-Axis label
yAxis.append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("fill", "#5D6971")
    .text("Price USD");

// Line path generator
var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d[value]); });

$('#coin-select').on('change', function() {
    currentData = allData[this.value];
    update();
});

$('#var-select').on('change', function() {
    value = this.value;
    update();
});

$('#date-slider').slider({
    range: true,
    max: 2017,
    min: 2013,
    step: 1,
    values: [2013, 2017],
    slide: function(event, ui) {
        startYear = ui.values[0];
        endYear = ui.values[1];
        update();
    }
});

d3.json("data/coins.json").then(function(data) {
    console.log(data);
    
    // Data cleaning
    for (var key in data) {
        data[key].forEach(function(d) {
            d['24h_vol'] = +d['24h_vol'];
            d['market_cap'] = +d['market_cap'];
            d['price_usd'] = +d['price_usd'];
            d['date'] = parseTime(d['date']);
        });
    }

    allData = data;
    currentData = data.bitcoin;
    
    update();

    // Add line to chart
    g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-with", "3px")
        .attr("d", line(currentData));

});

function setYAxisTitle(n) {
    if (value === 'price_usd') {
        n.innerHTML = 'Price USD';
    } else if (value === '24h_vol') {
        n.innerHTML = '24 Hour Trading Volume';
    } else {
        n.innerHTML = 'Market Cap';
    }
}

function update() {

    var filteredData = currentData.filter(function(d) {
        var date = d.date.toString();
        var dateArr = date.split(' ');
        var year = dateArr[3];
        if (year >= startYear && year <= endYear) {
            return true;
        }
    });

    var t = $('.axis-title')[0];
    setYAxisTitle(t);

    yAxisCall
        .tickFormat(function(d) {
            if (value === 'price_usd') {
                return d3.format('$,.0f')(d);
            } else if (value === '24h_vol') {
                return d3.format(',.0f')(d / 1000000) + 'M';
            } else {
                return d3.format('$,.0f')(d / 1000000) + 'M';
            }
        });

    // Set scale domains
    var max = d3.max(filteredData, function(d) {
        return d[value]; 
    });

    x.domain(d3.extent(filteredData, function(d) { return d.date; }));
    y.domain([0, max]);

    var svg = d3.select('body').transition();

    svg.select('.line')
        .duration(750)
        .attr('d', line(filteredData));
    svg.select('.x.axis')
        .duration(750)
        .call(xAxisCall.scale(x));
    svg.select('.y.axis')
        .duration(750)
        .call(yAxisCall.scale(y));

    /******************************** Tooltip Code ********************************/

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    g.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(filteredData, x0, 1),
            d0 = filteredData[i - 1],
            d1 = filteredData[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d[value]) + ")");
        focus.select("text").text(d[value]);
        focus.select(".x-hover-line").attr("y2", height - y(d[value]));
        focus.select(".y-hover-line").attr("x2", -x(d.date));
    }


    /******************************** Tooltip Code ********************************/

    $('#dateLabel1')[0].innerHTML = startYear;
    $('#dateLabel2')[0].innerHTML = endYear;
}

