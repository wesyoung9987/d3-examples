d3.json('data/buildings.json').then(function(data) {
  console.log(data);

  data.forEach(function(b) {
    b.height = +b.height;
  });

  var svg = d3.select('#chart-area').append('svg')
    .attr('width', 500)
    .attr('height', 500);

  var rects = svg.selectAll('rect')
    .data(data);
  
  var x = d3.scaleBand()
    .domain(data.map(function(d) {
      return d.name;
    }))
    .range([0, 400])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  var y = d3.scaleLinear()
    // .domain([0, 828])
    // this updated version is dynamic based on the max height of any value in the array.
    .domain([0, d3.max(data, function(d) {
      return d.height;
    })])
    .range([0, 400]);

  rects.enter()
    .append('rect')
      .attr('y', 0)
      .attr('x', function(d, i) {
        return x(d.name);
      })
      .attr('width', x.bandwidth)
      .attr('height', function(d) {
        return y(d.height);
      })
      .attr('fill', 'purple');

})
.catch(function(err) {
  console.log(err);
})