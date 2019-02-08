import $ from 'jquery';
import * as d3 from 'd3';
import responsivefy from './responsivefy';
import { getDistrictID } from './utilities';

// ////////////////////////////////////////////////////////////////////////////
// BUILD LEDE HORIZONTAL BAR CHART - Grade distributions
// ////////////////////////////////////////////////////////////////////////////

const color = d3.scaleOrdinal(['#329ce8', '#52b033', '#fec44f', '#ff8f24', '#e34e36']);

const svg = d3.select('#chart-district').append('svg')
  .attr('width', $('#chart-district').width())
  .attr('height', 48)
  .call(responsivefy);

const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const width = +svg.attr('width') - margin.left - margin.right;
const height = +svg.attr('height') - margin.top - margin.bottom;

const x = d3.scaleLinear()
            .range([0, width]);

const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// ////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS
// ////////////////////////////////////////////////////////////////////////////
// CHECK IF LETTERS COUNTED IS UNDEFINED SINCE IT'S 0 AND RETURN 0 INSTEAD
function checkForUndefined(count) {
  if (count) {
    return count;
  }
  return 0;
}
// BUILD AN OBJECT THAT CONTAINS COUNTS OF EACH LETTER GRADE
function buildGradeCounts(data, metric) {
  const counts = {};
  for (let i = 0; i < data.length; i += 1) {
    const key = data[i][metric];
    counts[key] = counts[key] ? counts[key] + 1 : 1;
  }
  const countsData = [
    { grade: 'A', count: checkForUndefined(counts.A) },
    { grade: 'B', count: checkForUndefined(counts.B) },
    { grade: 'C', count: checkForUndefined(counts.C) },
    { grade: 'D', count: checkForUndefined(counts.D) },
    { grade: 'F', count: checkForUndefined(counts.F) },
  ];

  let cumulative = 0;

  countsData.map((d) => {
    cumulative += d.count;
    d.cumulative = cumulative - d.count;
  });

  return (countsData);
}

let  countsData = [
  { grade: 'A', count: 0 },
  { grade: 'B', count: 0 },
  { grade: 'C', count: 0 },
  { grade: 'D', count: 0 },
  { grade: 'F', count: 0 },
];

let bars;
let barText;

// ////////////////////////////////////////////////////////////////////////////
// BUILD CHART
// ////////////////////////////////////////////////////////////////////////////
export default function buildDistrictDistributionChart() {
  const district = $('.district-name-title').text();

  bars = g.selectAll('.bar')
      .data(countsData)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 0)
        .attr('height', height)
        .attr('fill', d => color(d.grade));

  barText = g.selectAll('.bar-count')
      .data(countsData)
      .enter().append('text')
        .attr('class', 'bar-count')
        .attr('x', 0)
        .attr('y', height / 2)
        .attr('alignment-baseline', 'middle')
        .text(d => `${d.count}`)
        .style('text-anchor', 'end')
        .attr('opacity', 0);


  // WITH THE DISTRICT, GO RETRIEVE THE ID NUMBER
  const districtID = getDistrictID(district);

  // Where is this data coming from?
  const districtSchoolData = window.allSchoolData.filter(school => school['District Number'] === districtID);
  countsData = buildGradeCounts(districtSchoolData, 'Overall Grade');

  const total = d3.sum(countsData, d => d.count);
  x.domain([0, total]);

  bars = g.selectAll('.bar')
      .data(countsData)
        .transition()
          .duration(750)
          .attr('x', d => x(d.cumulative))
          .attr('width', d => x(d.count));


  barText = g.selectAll('.bar-count')
      .data(countsData)
      .transition()
        .duration(750)
        .attr('x', (d) => {
          if (width <= 356 && d.grade === 'F') {
            return width;
          }
          return (x(d.cumulative) + x(d.count)) - 5;
        })
        .attr('opacity', 1)
        .text((d) => {
          if (d.count > 0) {
            return `${d.count}`;
          }
        });
}

// ////////////////////////////////////////////////////////////////////////////
// UPDATE TO A NEW METRIC
// ////////////////////////////////////////////////////////////////////////////
export function updateDistrictDistributionChart(metric, data) {
  countsData = buildGradeCounts(data, metric);

  const total = d3.sum(countsData, d => d.count);
  x.domain([0, total]);

  bars = g.selectAll('.bar')
      .data(countsData)
        .transition()
          .duration(750)
          .attr('x', d => x(d.cumulative))
          .attr('width', d => x(d.count));

  barText = g.selectAll('.bar-count')
      .data(countsData)
      .transition()
        .duration(750)
        .attr('x', d => (x(d.cumulative) + x(d.count)) - 5)
        .attr('opacity', 1)
        .text((d) => {
          if (d.count > 0) {
            return `${d.count}`;
          }
        });
}