var margin = { left: 100, right: 10, top: 10, bottom: 150 };

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var flag = true;

var t = d3.transition().duration(750);

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
  .range([height, 0]); // this makes it inverted so 0 is at the bottom of the y axis

// X Scale
var x = d3.scaleBand()
  .range([0, width])
  .paddingInner(0.3)
  .paddingOuter(0.3);

// X Label
g.append('text')
  .attr('class', 'x axis-label')
  .attr('x', width / 2)
  .attr('y', height + 60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .text('Month');

// Y Label
var yLabel = g.append('text')
  .attr('class', 'y axis-label')
  .attr('x', - (height / 2))
  .attr('y', -60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .text('Revenue');

d3.json('data/revenues.json')
  .then(function(data) {
    console.log('data', data);

    data = data.map(function(item) {
      item.revenue = +item.revenue;
      item.profit = +item.profit;
      return item;
    });

    d3.interval(function() {
      update(data);
      flag = !flag;
    }, 1000);

    // Run for first time
    update(data);

  })
  .catch(function(err) {
    console.log(err);
  });

function update(data) {
  var value = flag ? 'revenue' : 'profit';

  x.domain(data.map(function(d) {
    return d.month;
  }));

  y.domain([0, d3.max(data, function(d) {
    return d[value];
  })]);

  var yAxisCall = d3.axisLeft(y)
    .ticks(5)
    .tickFormat(function(d) {
      return '$' + d;
    });
  yAccessGroup.transition(t).call(yAxisCall);

  var xAxisCall = d3.axisBottom(x);
  xAccessGroup.transition(t).call(xAxisCall) 
    .selectAll('text')
    .attr('y', '10')
    .attr('x', '-5')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-30)');

  // JOIN new data with old elements.
  var rects = g.selectAll('rect')
    .data(data, function(d) {
      return d.month; // tracking by month instead of index in array
    });

  // EXIT old elements not present in new data.
  rects.exit()
    .attr('fill', 'red')
  .transition(t)
    .attr('y', y(0))
    .attr('height', 0)
    .remove();

  // ENTER new elements present in new data.
  rects.enter()
    .append('rect')
      .attr('x', function(d) {
        return x(d.month);
      })
      .attr('width', x.bandwidth)
      .attr('fill', 'green')
      .attr('y', y(0))
      .attr('height', 0)
      // AND UPDATE old elements present in new data.
      .merge(rects)
      .transition(t)
        .attr('y', function(d) {
          return y(d[value]);
        })
        .attr('height', function(d) {
          return height - y(d[value]);
        })
        .attr('x', function(d) {
          return x(d.month);
        })
        .attr('width', x.bandwidth);

  var label = flag ? 'Revenue' : 'Profit';
  yLabel.text(label);
}
