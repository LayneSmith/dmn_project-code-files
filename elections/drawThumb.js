import $ from 'jquery';
import * as d3 from 'd3';
import counties from './countiesTX';
import { attachRegionClass } from './utilities';

// ////////////////////////////////////////////////////////////////////////////
// DRAW AND UPDATE THUMBNAIL
// ////////////////////////////////////////////////////////////////////////////

function populateClasses(d) {
  const fips = d.properties.FIPS;
  const thisRegion = attachRegionClass(fips);
  return `c${fips} ${d.properties.CNTY_NM.toLowerCase().replace(' ', '')} ${thisRegion} thumb-county`;
}

export function drawTexasThumb() {
  const margin = { left: 5, top: 5, right: 5, bottom: 5 };
  const width = $('#thumbTX').width();
  const mapWidth = width - margin.left - margin.right;
  const height = $('#thumbTX').height();
  const mapHeight = height - margin.top - margin.bottom;
  $('#thumbTX').height(height);

  // CREATE SVG OBJECT
  const svg = d3.select('#thumbTX').append('svg')
    .attr('width', width)
    .attr('height', height);

  // DRAW TEXAS THUMBNAIL COUNTIES
  const projection = d3.geoAlbersUsa()
    .scale(950)
    .translate([(width / 2) + 40, (height / 2) - 117])
  const path = d3.geoPath().projection(projection);
  const texasThumb = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top}) rotate(-2)`);
  texasThumb.selectAll('path')
    .data(counties.features).enter()
      .append('path')
      .attr('class', d => populateClasses(d))
      .attr('d', path)
      .on('click', function (d) {
      });
}
