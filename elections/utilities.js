import $ from 'jquery';
import * as d3 from 'd3';
import regions from './tx-regions';
import { TweenMax, TimelineLite } from 'gsap';


// ////////////////////////////////////////////////////////////////////////////
// ATTACHES CLASSES AS A STRING OF REQUIRED CLASSES
// ////////////////////////////////////////////////////////////////////////////
export function attachPartyClass(data, year, party) {
  if (party === 'democrat') {
    if (data[`dem_pct_${year}`] > data[`rep_pct_${year}`]) {
      return true;
    }
    return false;
  }
  if (party === 'republican') {
    if (data[`rep_pct_${year}`] > data[`dem_pct_${year}`]) {
      return true;
    }
    return false;
  }
}

export function attachRegionClass(fips) {
  let thisRegion = '';
  Object.entries(regions).forEach(([key, value]) => {
    if (value.includes(fips)) {
      thisRegion = key.toLowerCase().replace(' ', '');
    }
  });
  return thisRegion;
}

export function getPartyPercent(party, data) {
  const thisParty = data.candidateTotals.filter(f => f.party === party)[0];
  return thisParty.votePercent;
}

// ////////////////////////////////////////////////////////////////////////////
// RETURN TEH WINNER'S VALUE AS - FOR DEM AND + FOR REP
// ////////////////////////////////////////////////////////////////////////////
export function returnWinner(data, year) {
  if (data[`dem_pct_${year}`] > data[`rep_pct_${year}`]) {
    return (data[`dem_pct_${year}`] - data[`rep_pct_${year}`]) * -1;
  }
  return data[`rep_pct_${year}`] - data[`dem_pct_${year}`];
}

// Get line length
export function getLength(x1, x2, y1, y2) {
   return Math.sqrt( (x2-=x1)*x2 + (y2-=y1)*y2 );
}

export function getCountyName(fips, data){
  const county = data.filter(d => parseInt(d.fips) === parseInt(fips))[0];
  return county.name;
}

export function getCountyPop(fips, data){
  const county = data.filter(d => parseInt(d.fips) === parseInt(fips))[0];
  return county.pop2012;
}

export function getPartyResults(data, party) {
  const parties = {
    2186: 'Dem',
    2187: 'Rep',
    2188: 'Lib',
  }
  let votes;
  data.forEach((d) => {
    if (party === 'Dem' && d.candidateId === 2186) {
      votes = d.votePercent;
    }
    if (party === 'Rep' && d.candidateId === 2187) {
      votes = d.votePercent;
    }
    if (party === 'Lib' && d.candidateId === 2188) {
      votes = d.votePercent;
    }
  });
  return votes;
}

export function getCenter(county) {
  const element = county.node();
  const bbox = element.getBBox();
  return [bbox.x + (bbox.width / 2), bbox.y + (bbox.height / 2)];
}

const t = d3.transition()
    .duration(100)
    .ease(d3.easeLinear);

// ////////////////////////////////////////////////////////////////////////////
// REMOVE COUNTY SPECIFICS, thumbnails, 2012-2018, remove classes, reposition elemnet
// ////////////////////////////////////////////////////////////////////////////
export function resetCounties() {
  $('.chartWrapper .countyName').fadeOut();
  $('.chartWrapper .yearText').fadeOut();
  $('.chartWrapper .trails .trail').removeClass('active').fadeOut();
  $('.chartWrapper .county').removeClass('active').fadeOut();
}

// ////////////////////////////////////////////////////////////////////////////
// COUNTY WAS SELECTED, ADD STUFF
// ////////////////////////////////////////////////////////////////////////////

const years = ['2008', '2010', '2012', '2014', '2016', '2018'];

export function addYearLabels(fips) {
  $(`#chart svg .c${fips} circle`).each(function (idx) {
    const r = parseFloat($(this).attr('r'));
    const x = parseFloat($(this).attr('cx'));
    const y = parseFloat($(this).attr('cy'));
    d3.select(`#chart svg .c${fips}`).append('text')
      .attr('x', x + r + 5)
      .attr('y', y + 2)
      .classed('yearText', true)
      .text(years[idx]);
  });
}

export function addCountyName(fips, county) {
  const thisCounty = d3.select(`.chartWrapper .county.c${fips}`).node().getBBox();

  d3.select(`#chart svg .c${fips}`).append('text')
    .attr('x', thisCounty.x )
    .attr('y', thisCounty.y - 10)
    .classed('countyName', true)
    .text(`${county} County`);
}

export function displayClickedCounty(d) {
  // Reset
  $('.chartWrapper .yearText').fadeOut();
  $('.chartWrapper .countyName').fadeOut();
  $('.chartWrapper .county').removeClass('active');
  $('.chartWrapper .trail').removeClass('active');
  // If it's a county and not 'all'
  if (!isNaN(d.fips)) {
    // $(`.chartWrapper .trail.c${d.fips}`).insertAfter($('.chartWrapper .trail:last'))
    $(`.chartWrapper .c${d.fips}`).addClass('active').fadeIn();
    $(`.chartWrapper .county:not(.c${d.fips})`).fadeOut();
    $(`.chartWrapper .trails:not(.c${d.fips})`).fadeOut();
    // Add year labels
    addYearLabels(d.fips);
    addCountyName(d.fips, d.county);
  } else {
    $('.chartWrapper .county').fadeIn();
    $('.chartWrapper .trails').fadeIn();
  }
}

export function displaySelectedCounty(fips) {

  TweenMax.set('.all-trails path', { autoAlpha: 0 });
  TweenMax.set('.all-circles g', { autoAlpha: 0.05 });

  let tl = new TimelineLite();
  tl.clear();

  $('.tooltip').removeClass('active');
  $('.all-circles circle').addClass('suppressed');
  $(`.all-circles g.c${fips} circle`).removeClass('suppressed');
  $('.all-trails .trails').fadeOut();

  if (fips === 'all') {
    $('.all-circles circle').removeClass('suppressed');
    tl.to('.all-circles .county', 0.5, { autoAlpha: 1 });
    tl.to('.all-trails path', 0.5, { autoAlpha: 0 }, 0);
  } else {
    tl.to('.all-circles .county', 0.5, { autoAlpha: 0.05 });
    tl.to(`.all-circles .c${fips}`, 0.5, { autoAlpha: 1 }, 0);
    tl.to(`.all-trails .c${fips}`, 0.5, { autoAlpha: 1 }, 0);
  }
}

export function highlightThumbnail(county, circle) {
  // Get center

  d3.select('#thumbTX .thumbCircle').remove();

  let color;
  if (circle.hasClass('republican')) {
    color = '#e34e36';
  }
  if (circle.hasClass('democrat')) {
    color = '#329ce8';
  }
  const thumbCounty = d3.select(`#thumbTX svg .c${county.fips}`);
  const thumbCircleCenter = getCenter(thumbCounty);
  // Select circle
  d3.select('#thumbTX svg g').append('circle')
    .attr('class', `thumbCircle c${county.fips}`)
    .attr('cx', thumbCircleCenter[0])
    .attr('cy', thumbCircleCenter[1])
    .attr('fill', color)
    .attr('r', 0)
    .transition(t)
      .attr('r', 4);
}
