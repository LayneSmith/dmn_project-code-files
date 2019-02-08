import $ from 'jquery';
import * as d3 from 'd3';
import './race-synopsis';
import { refineData, showStrongestDemocratCounties, showStrongestRepublicanCounties, showTop10CountiesByPopulation, maxSwings, minSwings, movingLeft2008, movingLeft2016 } from './dataUtilities';
import { initializeChart } from './chart';
import { drawTexasThumb } from './drawThumb';
import { buildSelectMenus } from './selectMenu';
import { showFlipped, showRepublicans, showDemocrats } from './events';
import './scrollyTime';
import './buttons';
import './furniture';

// ////////////////////////////////////////////////////////////////////////////
// MAIN SCRIPT
// ////////////////////////////////////////////////////////////////////////////

d3.csv('data/texasElectionData.csv')
  .then((data) => {
    // BUILD UI
    buildSelectMenus(data);
    drawTexasThumb();

    $('.btn-flippers').click(() => {
      showFlipped();
    });
    $('.btn-republicans').click(() => {
      showRepublicans();
    });
    $('.btn-democrats').click(() => {
      showDemocrats();
    });

    // Make data adjustment and calculations
    const refinedData = refineData(data);

    // Initializze chart
    initializeChart(refinedData);

    // Button events that need data
    $('#showTop10CountiesByPopulation').click(() => {
      showTop10CountiesByPopulation(refinedData);
    });
    $('#showStrongestDemocratCounties').click(() => {
      showStrongestDemocratCounties(refinedData);
    });
    $('#showStrongestRepublicanCounties').click(() => {
      showStrongestRepublicanCounties(refinedData);
    });
    $('#maxSwings').click(() => {
      maxSwings(refinedData);
    });
    $('#minSwings').click(() => {
      minSwings(refinedData);
    });
    $('#movingLeft2008').click(() => {
      movingLeft2008(refinedData);
    });
    $('#movingLeft2016').click(() => {
      movingLeft2016(refinedData);
    });
  });