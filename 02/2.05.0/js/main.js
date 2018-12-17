/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/

var svg = d3.select('#chart-area').append('svg')
  .attr('width', 500)
  .attr('height', 400);

var rect = svg.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('fill', 'green')
  .attr('height', 30)
  .attr('width', 50);

var ellipse = svg.append('ellipse')
  .attr('cx', 400)
  .attr('cy', 350)
  .attr('rx', 75)
  .attr('ry', 50)
  .attr('fill', 'orange');

var line = svg.append('line')
  .attr('y1', 350)
  .attr('x1', 50)
  .attr('y2', 50)
  .attr('x2', 450)
  .attr('stroke', 'pink')
  .attr('stroke-width', 10);
