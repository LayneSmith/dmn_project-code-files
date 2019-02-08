import $ from 'jquery';
import * as d3 from 'd3';
import { getDistrictID, jitter } from './utilities';
import responsivefy from './responsivefy';

// ////////////////////////////////////////////////////////////////////////////
// BUILD SCHOOL TYPE CHARTS - Elementary, Middle, High
// ////////////////////////////////////////////////////////////////////////////

// Assign colors based on domain/range marriage
const colorScale = d3.scaleOrdinal()
  .domain(['A', 'B', 'C', 'D', 'F'])
  .range(['#329ce8', '#52b033', '#fec44f', '#ff8f24', '#e34e36']);

// Defaults
const restingOpacity = 0.3;
let currentMetric = 'Overall Score';

// Declare chart settings
const chartWidth = $('.snapshot-chart-schools').width();
const chartHeight = $('.snapshot-chart-schools').height() - 22;
const x = d3.scaleLinear([0, chartWidth]);
x.domain([50, 100]);
x.range([2, chartWidth - 2]);
const margin = { top: 20, right: 10, bottom: 32, left: 5 };
const width = chartWidth - margin.left - margin.right;
const height = chartHeight - margin.top - margin.bottom;

// Adjust chart callout depending on left or right side.
// x location
function adjustCalloutX(pxLoc){
  if (pxLoc >= width / 2){
    return pxLoc - 10;
  }
  return pxLoc + 10;
}
// alignment
function adjustAlignment(pxLoc){
  if (pxLoc >= width / 2){
    return 'end';
  }
  return 'start';
}

// Mouse over
function handleMouseOver(d) {
  const calloutString = `${d['Campus Name']}: ${d[currentMetric]}`;
  d3.select(this.parentNode).select('text').transition(100)
    .text(calloutString)
    .attr('opacity', 1)
    .attr('x', adjustCalloutX(d.xLoc))
    .attr('text-anchor', adjustAlignment(d.xLoc));
  d3.select(this)
      .transition(100)
        .attr('opacity', 1)
        .attr('y1', -30);

  $('#district-map .school').removeClass('selected');
  $(`#district-map .${d['Campus Number']}`).addClass('selected');
  const thisData = $(`#district-map .${d['Campus Number']}`)[0]['__data__'];

}

// Mouse out
function handleMouseOut(d) {
  d3.select(this.parentNode).select('text').transition(100)
    .attr('opacity', 0);
  d3.select(this)
    .transition(100)
      .attr('opacity', restingOpacity)
      .attr('y1', 0);
  $('#district-map .school').removeClass('selected');
}

// ////////////////////////////////////////////////////////////////////////////
// INITIALIZE THE CHART
// ////////////////////////////////////////////////////////////////////////////
export function buildSchoolTypeCharts() {
  // WITH THE DISTRICT, GO RETRIEVE THE ID NUMBER
  const district = $('.district-name-title').text();
  const districtID = getDistrictID(district);
  // Where is this data coming from?
  const districtSchoolData = window.allSchoolData.filter(school => school['District Number'] === districtID);

  const elementaries = districtSchoolData.filter(d => d['School Type'] === 'Elementary');
  const distElemMean = Math.round(d3.mean(elementaries, d => +d['Overall Score']));

  const middles = districtSchoolData.filter(d => d['School Type'] === 'Middle School');
  const distMiddleMean = Math.round(d3.mean(middles, d => +d['Overall Score']));

  const highs = districtSchoolData.filter(d => d['School Type'] === 'High School');
  const distHighsMean = Math.round(d3.mean(highs, d => +d['Overall Score']));

  let distMean;
  let distMeanCaret;
  let distMeanWords;
  let stateMeanCaret;
  let stateMeanWords;

  const districtSize = districtSchoolData[0]['District Size'];

  const elemMean = window.stateAverages[districtSize]['Elementary']['Overall Score'];
  const middleMean = window.stateAverages[districtSize]['Middle School']['Overall Score'];
  const highMean = window.stateAverages[districtSize]['High School']['Overall Score'];

  // ////////////////////////////////////////////////////////////////////////////
  // PUT A CHART IN EACH DIV
  // ////////////////////////////////////////////////////////////////////////////
  $('.snapshot-chart-schools').each(function (k, i) {
    $(this).find('svg').remove();

    const svg = d3.select(this).append('svg')
      .attr('width', chartWidth)
      .attr('height', chartHeight)
      .classed(`chart${k}`, true)
      .call(responsivefy);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const bars = g.selectAll('.bar');

    const background = g.append('rect')
      .attr('width', width)
      .attr('height', height - 20)
      .attr('fill', 'whitesmoke');

    const textBlock = g.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('class', 'school-type-hover')
      .attr('opacity', 0)
      .text('Text');

    const label50 =g.append('text')
      .attr('x', x(50))
      .attr('y', height - 10)
      .text('50');
    const label60 =g.append('text')
      .attr('x', x(60))
      .attr('y', height - 10)
      .text('60');
    const label70 =g.append('text')
      .attr('x', x(70))
      .attr('y', height - 10)
      .text('70');
    const label80 =g.append('text')
      .attr('x', x(80))
      .attr('y', height - 10)
      .text('80');
    const label90 =g.append('text')
      .attr('x', x(90))
      .attr('y', height - 10)
      .text('90');
    const label100 =g.append('text')
      .attr('x', x(99.7))
      .attr('y', height - 10)
      .attr('text-anchor', 'end')
      .text('100');

    // ////////////////////////////////////////////////////////////////////////
    // CREATE SCHOOLS CHARTS BASED ON TYPE
    // 0 = Elementary, 1 = Middle, 2 = High
    // ////////////////////////////////////////////////////////////////////////
    switch (k) {
      case 0: // CREATE ELEMENTARIES
        elementaries.map((d) => {
          if (d['Overall Score'] >= 50 && d['Overall Score'] <= 100) {
            d.xLoc = jitter(x(d['Overall Score']));
          } else {
            d.xLoc = x(0);
          }
        });
        bars.data(elementaries)
          .enter().append('line')
            .attr('class', d => `line ${d['Campus Number']}`)
            .attr('x1', d => d.xLoc)
            .attr('y1', 0)
            .attr('x2', d => d.xLoc)
            .attr('y2', height - 20)
            .attr('stroke-width', 3)
            .attr('opacity', restingOpacity)
            .attr('stroke', d => colorScale(d['Overall Grade']))
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);
            // .on('click', handleClick);

        if (isNaN(distElemMean)) {
          distMeanCaret = g.append('g')
            .attr('class', 'distMeanCaret')
            .attr('transform', `translate(${x(0)}, ${height - 20})`);
        } else {
          distMeanCaret = g.append('g')
            .attr('class', 'distMeanCaret')
            .attr('transform', `translate(${x(distElemMean)}, ${height - 20})`);
        }

        distMeanCaret.append('polygon')
          .attr('points', '0,0 5,10 -5,10')
          .attr('class', 'triangle')
          .attr('opacity', 1);
        distMeanCaret.append('text')
          .attr('x', 0)
          .attr('y', 10)
          .attr('class', 'mean');
        d3.select('.chart0 .mean')
          .append('tspan')
            .attr('x', 0)
            .attr('dy', 12)
            .attr('text-anchor', 'middle')
            .attr('class', 'mean-number')
            .text(distElemMean)
        d3.select('.chart0 .mean')
          .append('tspan')
            .attr('x', 0)
            .attr('dy', 14)
            .attr('text-anchor', 'middle')
            .text('Dist')
        d3.select('.chart0 .mean')
          .append('tspan')
            .attr('x', 0)
            .attr('dy', 12)
            .attr('text-anchor', 'middle')
            .text('avg.');

        stateMeanCaret = g.append('g')
          .attr('class', 'stateMeanCaret')
          .attr('transform', `translate(${x(elemMean)}, ${height - 20})`);
        stateMeanCaret.append('polygon')
          .attr('points', '0,0 5,10 -5,10')
          .attr('class', 'triangle')
          .attr('opacity', 1);
        stateMeanCaret.append('text')
          .attr('x', 0)
          .attr('y', 10)
          .attr('class', 'state-mean');
        d3.select('.chart0 .state-mean')
          .append('tspan')
            .attr('x', 0)
            .attr('dy', 12)
            .attr('text-anchor', 'middle')
            .attr('class', 'mean-number')
            .text(elemMean)
        d3.select('.chart0 .state-mean')
          .append('tspan')
            .attr('x', 0)
            .attr('dy', 14)
            .attr('text-anchor', 'middle')
            .text('Texas')
        d3.select('.chart0 .state-mean')
          .append('tspan')
            .attr('x', 0)
            .attr('dy', 12)
            .attr('text-anchor', 'middle')
            .text('avg.');

        break;

      case 1: // CREATE MIDDLE SCHOOLS
        middles.map((d) => {
          if (d['Overall Score'] >= 50 && d['Overall Score'] <= 100) {
            d.xLoc = jitter(x(d['Overall Score']));
          } else {
            d.xLoc = x(0);
          }
        });
        bars.data(middles)
          .enter().append('line')
            .attr('class', d => `line ${d['Campus Number']}`)
            .attr('x1', d => d.xLoc)
            .attr('y1', 0)
            .attr('x2', d => d.xLoc)
            .attr('y2', height - 20)
            .attr('stroke-width', 3)
            .attr('opacity', restingOpacity)
            .attr('stroke', d => colorScale(d['Overall Grade']))
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);
            // .on('click', handleClick);

          if (isNaN(distMiddleMean)) {
            distMeanCaret = g.append('g')
              .attr('class', 'distMeanCaret')
              .attr('transform', `translate(${x(0)}, ${height - 20})`);
          } else {
            distMeanCaret = g.append('g')
              .attr('class', 'distMeanCaret')
              .attr('transform', `translate(${x(distMiddleMean)}, ${height - 20})`);
          }

          distMeanCaret.append('polygon')
            .attr('points', '0,0 5,10 -5,10')
            .attr('class', 'triangle')
            .attr('opacity', 1);
          distMeanCaret.append('text')
            .attr('x', 0)
            .attr('y', 10)
            .attr('class', 'mean');
          d3.select('.chart1 .mean')
            .append('tspan')
              .attr('x', 0)
              .attr('dy', 12)
              .attr('class', 'mean-number')
              .attr('text-anchor', 'middle')
              .text(distMiddleMean);
          d3.select('.chart1 .mean')
            .append('tspan')
              .attr('x', 0)
              .attr('dy', 14)
              .attr('text-anchor', 'middle')
              .text('Dist')
          d3.select('.chart1 .mean')
            .append('tspan')
              .attr('x', 0)
              .attr('dy', 12)
              .attr('text-anchor', 'middle')
              .text('avg.');

          stateMeanCaret = g.append('g')
            .attr('class', 'stateMeanCaret')
            .attr('transform', `translate(${x(middleMean)}, ${height - 20})`);
          stateMeanCaret.append('polygon')
            .attr('points', '0,0 5,10 -5,10')
            .attr('class', 'triangle')
            .attr('opacity', 1);
          stateMeanCaret.append('text')
            .attr('x', 0)
            .attr('y', 10)
            .attr('class', 'state-mean');
          d3.select('.chart1 .state-mean')
            .append('tspan')
              .attr('x', 0)
              .attr('dy', 12)
              .attr('text-anchor', 'middle')
              .attr('class', 'mean-number')
              .text(middleMean)
          d3.select('.chart1 .state-mean')
            .append('tspan')
              .attr('x', 0)
              .attr('dy', 14)
              .attr('text-anchor', 'middle')
              .text('Texas')
          d3.select('.chart1 .state-mean')
            .append('tspan')
              .attr('x', 0)
              .attr('dy', 12)
              .attr('text-anchor', 'middle')
              .text('avg.');

        break;

      case 2: // CREATE HIGH SCHOOLS
        highs.map((d) => {
          if (d['Overall Score'] >= 50 && d['Overall Score'] <= 100) {
            d.xLoc = jitter(x(d['Overall Score']));
          } else {
            d.xLoc = x(0);
          }
        });
        bars.data(highs)
          .enter().append('line')
            .attr('class', d => `line ${d['Campus Number']}`)
            .attr('x1', d => d.xLoc)
            .attr('y1', 0)
            .attr('x2', d => d.xLoc)
            .attr('y2', height - 20)
            .attr('stroke-width', 3)
            .attr('opacity', restingOpacity)
            .attr('stroke', d => colorScale(d['Overall Grade']))
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut);
            // .on('click', handleClick);

          if (isNaN(distHighsMean)) {
            distMeanCaret = g.append('g')
              .attr('class', 'distMeanCaret')
              .attr('transform', `translate(${x(0)}, ${height - 20})`);
          } else {
            distMeanCaret = g.append('g')
              .attr('class', 'distMeanCaret')
              .attr('transform', `translate(${x(distHighsMean)}, ${height - 20})`);
          }

          distMeanCaret.append('polygon')
            .attr('points', '0,0 5,10 -5,10')
            .attr('class', 'triangle')
            .attr('opacity', 1);
          distMeanCaret.append('text')
            .attr('x', 0)
            .attr('y', 10)
            .attr('class', 'mean');
          d3.select('.chart2 .mean')
            .append('tspan')
              .attr('x', 0)
              .attr('dy', 12)
              .attr('text-anchor', 'middle')
              .attr('class', 'mean-number')
              .text(distHighsMean);
          d3.select('.chart2 .mean')
            .append('tspan')
              .attr('x', 0)
              .attr('dy', 14)
              .attr('text-anchor', 'middle')
              .text('Dist')
          d3.select('.chart2 .mean')
            .append('tspan')
              .attr('x', 0)
              .attr('dy', 12)
              .attr('text-anchor', 'middle')
              .text('avg.');

          stateMeanCaret = g.append('g')
            .attr('class', 'stateMeanCaret')
            .attr('transform', `translate(${x(highMean)}, ${height - 20})`);
          stateMeanCaret.append('polygon')
            .attr('points', '0,0 5,10 -5,10')
            .attr('class', 'triangle')
            .attr('opacity', 1);
          stateMeanCaret.append('text')
            .attr('x', 0)
            .attr('y', 10)
            .attr('class', 'state-mean');
          d3.select('.chart2 .state-mean')
            .append('tspan')
              .attr('x', 0)
              .attr('dy', 12)
              .attr('text-anchor', 'middle')
              .attr('class', 'mean-number')
              .text(highMean)
          d3.select('.chart2 .state-mean')
            .append('tspan')
              .attr('x', 0)
              .attr('dy', 14)
              .attr('text-anchor', 'middle')
              .text('Texas')
          d3.select('.chart2 .state-mean')
            .append('tspan')
              .attr('x', 0)
              .attr('dy', 12)
              .attr('text-anchor', 'middle')
              .text('avg.');

        break;
      default:
        break;
    }
  });
}

// ////////////////////////////////////////////////////////////////////////////
// UPDATE THE CHARTS
// ////////////////////////////////////////////////////////////////////////////
export function updateSchoolTypeChart(metric, data) {

  currentMetric = `${metric} Score`;
  const districtSize = data[0]['District Size'];

  const elementaries = data.filter(d => d['School Type'] === 'Elementary');
  const distElemMean = Math.round(d3.mean(elementaries, d => +d[currentMetric]));

  const middles = data.filter(d => d['School Type'] === 'Middle School');
  const distMiddleMean = Math.round(d3.mean(middles, d => +d[currentMetric]));

  const highs = data.filter(d => d['School Type'] === 'High School');
  const distHighsMean = Math.round(d3.mean(highs, d => +d[currentMetric]));

  const stateElemMean = window.stateAverages[districtSize]['Elementary'][currentMetric];
  const stateMiddleMean = window.stateAverages[districtSize]['Middle School'][currentMetric];
  const stateHighMean = window.stateAverages[districtSize]['High School'][currentMetric];

  // ////////////////////////////////////////////////////////////////////////
  // UPDATE SCHOOLS CHARTS BASED ON TYPE
  // 0 = Elementary, 1 = Middle, 2 = High
  // ////////////////////////////////////////////////////////////////////////
  $('.snapshot-chart-schools').each((k, i) => {
    const bars = d3.selectAll(`.chart${k} .line`);
    switch (k) {
      case 0: // Update elementary schools
        elementaries.map((d) => {
          if (d[currentMetric] >= 50 && d[currentMetric] <= 100) {
            d.xLoc = jitter(x(d[currentMetric]));
          } else {
            d.xLoc = x(0);
          }
        });
        bars.data(elementaries)
          .attr('class', d => `line ${d['Campus Number']}`)
          .transition()
            .duration(400)
              .attr('x1', d => d.xLoc)
              .attr('x2', d => d.xLoc)
              .attr('stroke', d => colorScale(d[`${metric} Grade`]));

        bars.exit().remove();

        if (isNaN(distElemMean)) {
          d3.select('.chart0 .distMeanCaret')
            .transition()
              .duration(400)
                .attr('transform', `translate(${x(0)}, ${height - 20})`);
        } else {
          d3.select('.chart0 .distMeanCaret')
            .transition()
              .duration(400)
                .attr('transform', `translate(${x(distElemMean)}, ${height - 20})`);
        }

        d3.select('.chart0 .stateMeanCaret')
          .transition()
            .duration(400)
              .attr('transform', `translate(${x(stateElemMean)}, ${height - 20})`);

        d3.select('.chart0 .mean-number').text(distElemMean);
        d3.select('.chart0 .stateMeanCaret .mean-number').text(stateElemMean);

        break;

      case 1: // Update middle schools
        middles.map((d) => {
          if (d[currentMetric] >= 50 && d[currentMetric] <= 100) {
            d.xLoc = jitter(x(d[currentMetric]));
          } else {
            d.xLoc = x(0);
          }
        });
        bars.data(middles)
          .attr('class', d => `line ${d['Campus Number']}`)
          .transition()
            .duration(400)
              .attr('x1', d => d.xLoc)
              .attr('x2', d => d.xLoc)
              .attr('stroke', d => colorScale(d[`${metric} Grade`]));

        bars.exit().remove();

        if (isNaN(distMiddleMean)) {
          d3.select('.chart1 .distMeanCaret')
            .transition()
              .duration(400)
                .attr('transform', `translate(${x(0)}, ${height - 20})`);
        } else {
          d3.select('.chart1 .distMeanCaret')
            .transition()
              .duration(400)
                .attr('transform', `translate(${x(distMiddleMean)}, ${height - 20})`);
        }

        d3.select('.chart1 .stateMeanCaret')
          .transition()
            .duration(400)
              .attr('transform', `translate(${x(stateMiddleMean)}, ${height - 20})`);

        d3.select('.chart1 .mean-number').text(distMiddleMean);
        d3.select('.chart1 .stateMeanCaret .mean-number').text(stateMiddleMean);

        break;

      case 2: // Update high schools
        highs.map((d) => {
          if (d[currentMetric] >= 50 && d[currentMetric] <= 100) {
            d.xLoc = jitter(x(d[currentMetric]));
          } else {
            d.xLoc = x(0);
          }
        });
        bars.data(highs)
          .attr('class', d => `line ${d['Campus Number']}`)
          .transition()
            .duration(400)
              .attr('x1', d => d.xLoc)
              .attr('x2', d => d.xLoc)
              .attr('stroke', d => colorScale(d[`${metric} Grade`]));

        bars.exit().remove();

        if (isNaN(distHighsMean)) {
          d3.select('.chart2 .distMeanCaret')
            .transition()
              .duration(400)
                .attr('transform', `translate(${x(0)}, ${height - 20})`);
        } else {
          d3.select('.chart2 .distMeanCaret')
            .transition()
              .duration(400)
                .attr('transform', `translate(${x(distHighsMean)}, ${height - 20})`);
        }

        d3.select('.chart2 .stateMeanCaret')
          .transition()
            .duration(400)
              .attr('transform', `translate(${x(stateHighMean)}, ${height - 20})`);

        d3.select('.chart2 .distMeanCaret .mean-number').text(distHighsMean);
        d3.select('.chart2 .stateMeanCaret .mean-number').text(stateHighMean);

        break;

      default:
        break;
    }
  });
}
