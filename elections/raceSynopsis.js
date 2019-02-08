import races from './yearly-results';
import $ from 'jquery';
import * as d3 from 'd3';

// ////////////////////////////////////////////////////////////////////////////
// BUILD RACE SYNOPSIS WHEN HOVERED
// ////////////////////////////////////////////////////////////////////////////

const pctFormat = d3.format('.1%');
const addCommas = d3.format(',');

$.each(races, (index, value) => {
  const $thisDiv = $(`#race${index}`);
  $thisDiv.find('.head').append(` ${index} ${value.race}`);
  $thisDiv.find('.turnout').append(` ${pctFormat(value.turnout)}`);
  // Populate Republican box
  $thisDiv.find('.republican .name').text(` ${value.rep_candidate}`);
  $thisDiv.find('.republican .votes').text(`${addCommas(value.rep_votes)} votes`);
  $thisDiv.find('.republican .percent').text(`${pctFormat(value.rep_votes/value.total_votes)}`);
  // Populate Democrat box
  $thisDiv.find('.democrat .name').text(` ${value.dem_candidate}`);
  $thisDiv.find('.democrat .votes').text(`${addCommas(value.dem_votes)} votes`);
  $thisDiv.find('.democrat .percent').text(`${pctFormat(value.dem_votes/value.total_votes)}`);

  const repWidth = Math.floor((value.rep_votes/value.total_votes) * 100);
  const demWidth = Math.floor((value.dem_votes/value.total_votes) * 100);
  const otherWidth = ((value.total_votes - value.rep_votes - value.dem_votes) / value.total_votes) * 100;

  $thisDiv.find('.chartline .republican').css('width', `${repWidth}%`).text(pctFormat(value.rep_votes/value.total_votes));
  $thisDiv.find('.chartline .other').css('width', `${otherWidth}%`);
  $thisDiv.find('.chartline .democrat').css('width', `${demWidth}%`).text(pctFormat(value.dem_votes/value.total_votes));
});
