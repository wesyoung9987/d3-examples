var data = [25, 20, 10, 12, 15];

var svg = d3.selectAll('#chart-area').append('svg')
  .attr('width', 400)
  .attr('height', 400);

var circles = svg.selectAll('circle')
  .data(data);

circles.enter()
  .append('circle')
    .attr('cx', function(d, i) {
      return (i * 50) + 25;
    })
    .attr('cy', 25)
    .attr('r', function(d) {
      return d;
    })
    .attr('fill', 'red');
