d3.csv('data/ages.csv').then(function(data) {

  data.forEach(function(d) {
    d.age = +d.age;
  });

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
        return d.age * 2;
      })
      .attr('fill', function(d) {
        if (d.name === 'Tony') {
          return 'blue';
        }

        return 'red';
      });

}).catch(function(err) {
  console.log(err);
});
