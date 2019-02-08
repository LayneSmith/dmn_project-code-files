import $ from 'jquery';
import * as d3 from 'd3';
import responsivefy from './responsivefy';
import { attachPartyClass, attachRegionClass, displayClickedCounty } from './utilities';
import { buildToolTip } from './tooltips';
import { buildScrollyTime } from './scrollyTime';

// ////////////////////////////////////////////////////////////////////////////
// BUILD MAIN CHART
// ////////////////////////////////////////////////////////////////////////////

const margin = { left: 30, top: 10, right: 0, bottom: 100 };
const width = $('#election-turnout').width();
const chartWidth = width - margin.left - margin.right;
const height = $('#election-turnout').height();
const chartHeight = height - margin.top - margin.bottom;
const windowWidth = $(window).width();

function handleClick(d, i) {
  displayClickedCounty(d);
}

function handleMouseOut(d) {
  // const thisCounty = d.fips;
  d3.select('.tooltip')
    .classed('active', false);
  $(this).removeClass('highlighted');

  d3.select('#thumbTX circle')
    .transition(t)
      .attr('r', 0);
}

// SET THE SCALES
// Party strength
const xScale = d3.scaleLinear()
  .range([0, (chartWidth)])
  .domain([-1, 1]);
// Turnout strength
let yScale;
let rScale;

const t = d3.transition()
  .duration(100)
  .ease(d3.easeLinear);

// CREATE SVG OBJECT
const svg = d3.select('#chart').append('svg')
  .attr('width', width)
  .attr('height', height)
  // .call(responsivefy);

// DRAW X-AXIS LABELS
svg.append('text')
  .attr('class', 'x title')
  .attr('text-anchor', 'end')
  .attr('x', () => {
    if (windowWidth <= 600) {
      return width - 30;
    } return width - 38;
  })
  .attr('y', margin.top + 40)
  .text('More Republican');
svg.append('text')
  .attr('class', 'x title')
  // .attr('x', margin.left + 70)
  .attr('x', () => {
    if (windowWidth <= 600) {
      return margin.left + 30;
    } return margin.left + 70;
  })
  .attr('y', margin.top + 40)
  .attr('text-anchor', 'start')
  .text('More Democratic');

// DRAW TRIANGLES
svg.append('g')
  // .attr('transform', `translate(${margin.left + 50}, ${margin.top + 52}) rotate(-90)`)
  .attr('transform', () => {
    if (windowWidth <= 600) {
      return `translate(${margin.left + 15}, ${margin.top + 42}) rotate(-90)`;
    } return `translate(${margin.left + 50}, ${margin.top + 40}) rotate(-90)`;
  })
  .append('polygon')
  .attr('points', '6,0 12,12 0,12')
  .attr('class', 'triangle democrat');
svg.append('g')
  // .attr('transform', `translate(${width - 20 }, ${margin.top + 50 - 10}) rotate(90)`)
  .attr('transform', () => {
    if (windowWidth <= 600) {
      return `translate(${width - 15}, ${margin.top + 30}) rotate(90)`;
    } return `translate(${width - 20}, ${margin.top + 30}) rotate(90)`;
  })
  .append('polygon')
  .attr('points', '6,0 12,12 0,12')
  .attr('class', 'triangle republican');


// CREATE WRAPPER OBJECT
const wrapper = svg.append('g').attr('class', 'chartWrapper')
  .attr('transform', `translate(${margin.left}, ${margin.top})`)


// DRAW Y-AXIS LABEL
wrapper.append('g')
  .append('text')
  .attr('class', 'y title')
  .attr('text-anchor', 'middle')
  .attr('transform', `translate(60, ${chartHeight / 2}) rotate(-90)`)
  .attr('alignment-baseline', 'hanging')
  .text('Voter turnout');

export function initializeChart(data) {

  // Get list of all populations for rScale
  const populations = [];
  data.forEach((d) => {
    populations.push(d.total_voters_2008);
    populations.push(d.total_voters_2010);
    populations.push(d.total_voters_2012);
    populations.push(d.total_voters_2014);
    populations.push(d.total_voters_2016);
    populations.push(d.total_voters_2018);
  });
  // Get list of all populations for rScale
  const turnouts = [];
  data.forEach((d) => {
    turnouts.push(d.turnout_2008);
    turnouts.push(d.turnout_2010);
    turnouts.push(d.turnout_2012);
    turnouts.push(d.turnout_2014);
    turnouts.push(d.turnout_2016);
    turnouts.push(d.turnout_2018);
  });

  yScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain(d3.extent(turnouts))
    .nice();

  const yAxis = d3.axisLeft()
    .tickSize(-chartWidth)
    .tickFormat(d3.format('.0%'))
    .scale(yScale);

  // Add y axis lines
  wrapper.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .call(yAxis);

  // County total voters
  rScale = d3.scaleLinear()
    .range([2, 40])
    .domain(d3.extent(populations))
    .nice();

  // DRAW CENTER LINE
  wrapper.append('line')
    .attr('class', 'center-line')
    .attr('opacity', 1)
    .attr('x1', xScale(0))
    .attr('y1', yScale(0.9))
    .attr('x2', xScale(0))
    .attr('y2', yScale(0.1));

  const line = d3.line()
    .x(d => xScale(d.winnerValue)) // set the x values for the line generator
    .y(d => yScale(d.turnout)) // set the y values for the line generator
    .curve(d3.curveCardinal)

  // BUILD TRAILS GROUP SEPARATE SO THEY CAN LIVE BEHIND CIRCLES
  const trailsGroups = wrapper.append('g').classed('all-trails', true);
  data.forEach((d) => {
    const lineData = [
      { winnerValue: d.winnerValue_2008, turnout: d.turnout_2008 },
      { winnerValue: d.winnerValue_2010, turnout: d.turnout_2010 },
      { winnerValue: d.winnerValue_2012, turnout: d.turnout_2012 },
      { winnerValue: d.winnerValue_2014, turnout: d.turnout_2014 },
      { winnerValue: d.winnerValue_2016, turnout: d.turnout_2016 },
      { winnerValue: d.winnerValue_2018, turnout: d.turnout_2018 },
    ];
    const thisRegion = attachRegionClass(d.fips);
    const thisLineGroup = trailsGroups.append('path')
      .datum(lineData)
      .attr('class', `trail c${d.fips} ${thisRegion}`)
      .classed('allRepublican', d.republican)
      .classed('allDemocrat', d.democrat)
      .attr('d', line);
  });

  // BUILD STRAIGHT LINE GROUPS JUST FOR FLIP YEARS
  const pointerLineGroups = wrapper.append('g').classed('all-lines', true);
  data.forEach((d) => {
    const lineData2008 = [
      { winnerValue: d.winnerValue_2008, turnout: d.turnout_2008 },
      { winnerValue: d.winnerValue_2018, turnout: d.turnout_2018 },
    ];
    const lineData2014 = [
      { winnerValue: d.winnerValue_2014, turnout: d.turnout_2014 },
      { winnerValue: d.winnerValue_2018, turnout: d.turnout_2018 },
    ];
    const directionData = [
      { winnerValue: d.winnerValue_2014, turnout: d.turnout_2014 },
      { winnerValue: d.winnerValue_2018, turnout: d.turnout_2018 },
    ];

    if (d.movingLeft) {
      const leftLineGroup = pointerLineGroups.append('path')
        .datum(directionData)
        .attr('class', `c${d.fips}`)
        .classed('movingLeft', d.movingLeft)
        .attr('d', line);
    }

    if (d.movingRight) {
      const rightLineGroup = pointerLineGroups.append('path')
        .datum(directionData)
        .attr('class', `c${d.fips}`)
        .classed('movingRight', d.movingRight)
        .attr('d', line);
    }

    if (d.flipToDem2008) {
      const thisLineGroup2008 = pointerLineGroups.append('path')
        .datum(lineData2008)
        .attr('class', `pointer-line c${d.fips}`)
        .classed('flipToDem2008', d.flipToDem2008)
        .attr('d', line);
    }

    if (d.flipToDem2014) {
      const thisLineGroup2014 = pointerLineGroups.append('path')
        .datum(lineData2014)
        .attr('class', `pointer-line c${d.fips}`)
        .classed('flipToDem2014', d.flipToDem2014)
        .attr('d', line);
    }

    if (d.flipToRep2008) {
      const thisLineGroup2008 = pointerLineGroups.append('path')
        .datum(lineData2008)
        .attr('class', `pointer-line c${d.fips}`)
        .classed('flipToRep2008', d.flipToRep2008)
        .attr('d', line);
    }

    if (d.flipToRep2014) {
      const thisLineGroup2014 = pointerLineGroups.append('path')
        .datum(lineData2014)
        .attr('class', `pointer-line c${d.fips}`)
        .classed('flipToRep2014', d.flipToRep2014)
        .attr('d', line);
    }
  });

  const circleGroups = wrapper.append('g').classed('all-circles', true);

  data.forEach((d) => {
    // ATTACH REGION CLASS
    const thisRegion = attachRegionClass(d.fips);
    const thisCountyGroup = circleGroups.append('g')
      .attr('id', `c${d.fips}`)
      .attr('class', `county c${d.fips} ${thisRegion}`)
      .classed('flipper', d.flipper)
      .classed('flipToDem2008', d.flipToDem2008)
      .classed('flipToDem2014', d.flipToDem2014)
      .classed('flipToRep2008', d.flipToRep2008)
      .classed('flipToRep2014', d.flipToRep2014)
      .classed('movingLeft', d.movingLeft)
      .classed('movingRight', d.movingRight)
      .classed('allRepublican', d.republican)
      .classed('allDemocrat', d.democrat);

    thisCountyGroup.selectAll('.y2008')
      .data([d], d => d.fips)
      .enter().append('circle')
      .classed('democrat', dt => attachPartyClass(dt, '2008', 'democrat'))
      .classed('republican', dt => attachPartyClass(dt, '2008', 'republican'))
      .classed('y2008', true)
      .attr('cx', dt => xScale(dt.winnerValue_2008))
      .attr('cy', dt => yScale(dt.turnout_2008))
      .attr('r', dt => rScale(dt.total_voters_2008))
      // .on('click', handleClick)
      .on('mouseover', buildToolTip)
      .on('mouseout', handleMouseOut);

    thisCountyGroup.selectAll('.y2010')
      .data([d], d => d.fips)
      .enter().append('circle')
      .classed('democrat', dt => attachPartyClass(dt, '2010', 'democrat'))
      .classed('republican', dt => attachPartyClass(dt, '2010', 'republican'))
      .classed('y2010', true)
      .attr('cx', dt => xScale(dt.winnerValue_2010))
      .attr('cy', dt => yScale(dt.turnout_2010))
      .attr('r', dt => rScale(dt.total_voters_2010))
      // .on('click', handleClick)
      .on('mouseover', buildToolTip)
      .on('mouseout', handleMouseOut);

    thisCountyGroup.selectAll('.y2012')
      .data([d], d => d.fips)
      .enter().append('circle')
      .classed('democrat', dt => attachPartyClass(dt, '2012', 'democrat'))
      .classed('republican', dt => attachPartyClass(dt, '2012', 'republican'))
      .classed('y2012', true)
      .attr('cx', dt => xScale(dt.winnerValue_2012))
      .attr('cy', dt => yScale(dt.turnout_2012))
      .attr('r', dt => rScale(dt.total_voters_2012))
      // .on('click', handleClick)
      .on('mouseover', buildToolTip)
      .on('mouseout', handleMouseOut);

    thisCountyGroup.selectAll('.y2014')
      .data([d], d => d.fips)
      .enter().append('circle')
      .classed('democrat', dt => attachPartyClass(dt, '2014', 'democrat'))
      .classed('republican', dt => attachPartyClass(dt, '2014', 'republican'))
      .classed('y2014', true)
      .attr('cx', dt => xScale(dt.winnerValue_2014))
      .attr('cy', dt => yScale(dt.turnout_2014))
      .attr('r', dt => rScale(dt.total_voters_2014))
      // .on('click', handleClick)
      .on('mouseover', buildToolTip)
      .on('mouseout', handleMouseOut);

    thisCountyGroup.selectAll('.y2016')
      .data([d], d => d.fips)
      .enter().append('circle')
      .classed('democrat', dt => attachPartyClass(dt, '2016', 'democrat'))
      .classed('republican', dt => attachPartyClass(dt, '2016', 'republican'))
      .classed('y2016', true)
      .attr('cx', dt => xScale(dt.winnerValue_2016))
      .attr('cy', dt => yScale(dt.turnout_2016))
      .attr('r', dt => rScale(dt.total_voters_2016))
      // .on('click', handleClick)
      .on('mouseover', buildToolTip)
      .on('mouseout', handleMouseOut);

    thisCountyGroup.selectAll('.y2018')
      .data([d], d => d.fips)
      .enter().append('circle')
      .classed('democrat', dt => attachPartyClass(dt, '2018', 'democrat'))
      .classed('republican', dt => attachPartyClass(dt, '2018', 'republican'))
      .classed('y2018', true)
      .attr('cx', dt => xScale(dt.winnerValue_2018))
      .attr('cy', dt => yScale(dt.turnout_2018))
      .attr('r', dt => rScale(dt.total_voters_2018))
      // .on('click', handleClick)
      .on('mouseover', buildToolTip)
      .on('mouseout', handleMouseOut);
  });

  // ADD NUMBER COUNTS
  svg.append('text')
    .attr('class', 'dem-counts')
    .attr('x', () => {
      if (windowWidth <= 600) {
        return margin.left + 30;
      } return margin.left + 70;
    })
    .attr('y', margin.top + 75)
    .attr('text-anchor', 'start')
    .text('0');
  svg.append('text')
    .attr('class', 'rep-counts')
    .attr('text-anchor', 'end')
    .attr('x', () => {
      if (windowWidth <= 600) {
        return width - 30;
      } return width - 38;
    })
    .attr('y', margin.top + 75)
    .text('0');

  // ADD "COUNTIES"
  svg.append('text')
    .attr('class', 'counties dem')
    .attr('x', () => {
      if (windowWidth <= 600) {
        return margin.left + 30;
      } return margin.left + 70;
    })
    .attr('y', margin.top + 90)
    .attr('text-anchor', 'start')
    .text('counties');
  svg.append('text')
    .attr('class', 'counties rep')
    .attr('text-anchor', 'end')
    .attr('x', () => {
      if (windowWidth <= 600) {
        return width - 30;
      } return width - 38;
    })
    .attr('y', margin.top + 90)
    .text('counties');

    // Display initial counts
    $('.dem-counts').text($('circle.democrat.y2018').length);
    $('.rep-counts').text($('circle.republican.y2018').length);

  buildScrollyTime();
}
