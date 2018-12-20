var margin = { left: 100, right: 10, top: 10, bottom: 150 };

var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var t = d3.transition().duration(300);

var index = 0;

var g = d3.select('#chart-area')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

// Y Axis
var yAccessGroup = g.append('g')
  .attr('class', 'y-axis');

// X Axis
var xAccessGroup = g.append('g')
  .attr('class', 'x axis')
  .attr('transform', 'translate(0, ' + height + ')');

// Y Scale
var y = d3.scaleLinear()
  .domain([0, 90])
  .range([height, 0]);

// X Scale
var x = d3.scaleLog()
  .domain([300, 150000])
  .range([0, width]);

// X Label
g.append('text')
  .attr('class', 'x axis-label')
  .attr('x', width / 2)
  .attr('y', height + 60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .text('GDP Per Capita ($)');

// Y Label
g.append('text')
  .attr('class', 'y axis-label')
  .attr('x', - (height / 2))
  .attr('y', -60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .text('Life Expectancy (Years)');

// Year Display
var year = g.append('text')
  .attr('x', width - 100)
  .attr('y', height - 30)
  .attr('font-size', '20px');

d3.json("data/data.json").then(function(data){

  var updatedData = data.reduce(function(acc, curr) {
    var filtered = curr.countries.filter(function(c) {
      if (c.income && c.life_exp) {
        c.income = +c.income;
        c.life_exp = +c.life_exp;
        return c;
      };
    });

    curr.countries = filtered;
    acc.push(curr);
    return acc;
  }, []);

  console.log(updatedData);

  d3.interval(function() {
    index = index + 1;
    if (!updatedData[index]) {
      index = 0;
    }
    update(updatedData[index].countries, updatedData[index].year);
  }, 500);

  update(updatedData[0].countries, updatedData[0].year);
});

function update(data, currentYear) {

  var yAxisCall = d3.axisLeft(y)
  yAccessGroup.transition(t).call(yAxisCall);

  var xAxisCall = d3.axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat(function(d) {
      return '$' + d;
    });
  xAccessGroup.transition(t).call(xAxisCall);

  var circles = g.selectAll('circle')
    .data(data, function(d) {
      return d.country;
    });

  circles.exit().remove();

  var rScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return d.population;
    })])
    .range([5, 25]);

  var cScale = d3.scaleOrdinal()
    .domain(['africa', 'americas', 'asia', 'europe'])
    .range(d3.schemeCategory10)
  
  circles.enter()
    .append('circle')
      .attr('cx', function(d) {
        return x(d.income);
      })
      .attr('fill', function(d) {
        return cScale(d.continent);
      })
      .attr('cy', function(d) {
        return y(d.life_exp);
      })
      .attr('r', function(d) {
        return rScale(d.population);
      })
      .merge(circles)
      .transition(t)
        .attr('r', function(d) {
          return rScale(d.population);
        })
        .attr('cx', function(d) {
          return x(d.income);
        })
        .attr('cy', function(d) {
          return y(d.life_exp);
        });

  year.text(currentYear);
}
