/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.8 - Activity: Your first visualization!
*/

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

  rects.enter()
    .append('rect')
      .attr('x', function(d, i) {
        return (i * 30) + 20;
      })
      .attr('width', '20')
      .attr('height', function(d) {
        return d.height;
      })
      .attr('fill', 'purple');

})
.catch(function(err) {
  console.log(err);
})