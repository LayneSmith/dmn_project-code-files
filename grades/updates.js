import $ from 'jquery';
import { updateMap, updateMapMetrics } from './maps';
import { populateDistrictDistributionChart, updateDistrictDistributionChart } from './buildGradeDistributionHorizontalChart';
import { populateSchoolTypeChart, updateSchoolTypeChart } from './buildSchoolTypeCharts';
import { toTitleCase, getDistrictID } from './utilities';
import buildTables from './buildTables';
import messages from './messages';

// ////////////////////////////////////////////////////////////////////////////
// UPDATE TO A NEW DISTRICT
// ////////////////////////////////////////////////////////////////////////////

export function updateDistrict(selected, metric) {
  // console.clear();
  console.group('UPDATING DISTRICT');
  console.log(`Changing district to ${selected}`);
  // Filter new district
  const filtered = window.allSchoolData.filter(d => d['District Number'] === selected);
  console.log('Filtered', filtered);
  // Change DOM names
  $('.district-name-title').text(toTitleCase(filtered[0]['District Name'].replace(' ISD', '').toLowerCase()));
  $('.district-name-chart').text(toTitleCase(filtered[0]['District Name'].replace(' ISD', '').toLowerCase()));
  $('.district-name-head').text(`A look at ${toTitleCase(filtered[0]['District Name'])}`);
  // Updates
  updateMap(selected, filtered, metric);
  populateDistrictDistributionChart(selected, filtered, metric);
  populateSchoolTypeChart(filtered, metric);
  buildTables(filtered);
  // $('.metric-explainer').html(messages[metric]);
  console.groupEnd();
}

// ////////////////////////////////////////////////////////////////////////////
// UPDATE TO A NEW METRIC
// ////////////////////////////////////////////////////////////////////////////

export function updateMetrics(metric) {

  const district = $('.district-name-title').text();
  console.log('DISTRICT', district);
  const districtID = getDistrictID(district);

  if (metric === 'Overall Performance'){
    metric = 'Overall';
  }
  const data = window.allSchoolData.filter(d => d['District Number'] === districtID);

  console.group('UPDATING METRIC');
  console.log(`Changing metric to ${metric}`);
  console.log('Using data', data);
  // Updates
  updateMapMetrics(`${metric} Grade`);
  updateDistrictDistributionChart(`${metric} Grade`, data);
  updateSchoolTypeChart(metric, data);
  console.groupEnd();
}
