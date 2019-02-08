import $ from 'jquery';
import * as d3 from 'd3';
import getStateAverages from './getStateAverages';
import buildAutoComplete from './autocomplete';
import { buildSchoolTypeCharts } from './buildSchoolTypeCharts';
import { buildMap } from './maps';
import buildDistrictDistributionChart from './buildGradeDistributionHorizontalChart';
import buildTables from './buildTables';
import { getLetterGrade, getDistrictID, getDistrictSize } from './utilities';
import { updateMetrics } from './updates';
import './dropdown';

// ////////////////////////////////////////////////////////////////////////////
// GROOM DATA TO A USEFUL, CONSISTENT FORMAT
// ////////////////////////////////////////////////////////////////////////////

let currentDistrict; // Current district
let districtID; // Current districtID
let schoolData; // Holds on school data
let districtEnrollments; // Holds district enrollments
let stateAverages; // Holds datasets for state averages based on school size

// School size designations
const sizes = ['large', 'mediumLarge', 'medium', 'mediumSmall', 'small'];
const enrollmentScale = {
  large: [50000, 100000000],
  mediumLarge: [25000, 49999],
  medium: [10000, 24999],
  mediumSmall: [5000, 9999],
  small: [0, 4999],
};


export function buildData(district) {

  currentDistrict = district;

  // IMPORT SCHOOL DATA
  // Declare
  const files = ['data/schools.csv', 'data/district-counts.csv'];
  const promises = [];
  // Assign to promises
  files.forEach((url) => {
    promises.push(d3.csv(url));
  });
  // When promises complete...
  Promise.all(promises).then((values) => {
    // Assign results to descriptive variables
    window.allSchoolData = values[0];
    values[0] = null; // Garbage collection
    window.districtEnrollments = values[1];
    values[1] = null; // Garbage collection

    window.districtEnrollments.map((d) => {
      // Get district size calculation from scale above
      sizes.forEach((k, i) => {
        if (d['Total Number of Students'] > enrollmentScale[k][0] && d['Total Number of Students'] < enrollmentScale[k][1] ) {
          d['District Size'] = k;
        }
      });
    });

    districtID = getDistrictID(district, districtEnrollments);

    // Convert data to numbers and do some housekeeping
    window.allSchoolData.map((d) => {
      if (d.lat) {
        d.lat = +d.lat;
        d.long = +d.long;
        d['% Eco Dis'] = +d['% Eco Dis'];
        d['% LEP Students'] = +d['% LEP Students'];
        d['Academic Growth Score'] = +d['Academic Growth Score'];
        d['Academic Growth Grade'] = getLetterGrade(d['Academic Growth Score']);
        d['Closing the Gaps Score'] = +d['Closing the Gaps Score'];
        d['Closing the Gaps Grade'] = getLetterGrade(d['Closing the Gaps Score']);
        d['Overall Score'] = +d['Overall Score'];
        d['Overall Grade'] = getLetterGrade(d['Overall Score']);
        d['Relative Performance Score'] = +d['Relative Performance Score'];
        d['Relative Performance Grade'] = getLetterGrade(d['Relative Performance Score']);
        d['Student Achievement Score'] = +d['Student Achievement Score'];
        d['Student Achievement Grade'] = getLetterGrade(d['Student Achievement Score']);
        d['Total Number of Students'] = +d['Total Number of Students'];
        d['gradegrp'] = +d['gradegrp'];
        d['zip'] = +d['zip'];
        d['zipmail'] = +d['zipmail'];
        d['District Size'] = getDistrictSize(districtID);
      }
    });

    // Calculate state averages based on district sizes
    window.stateAverages = getStateAverages();

    // START BUILDING THE PAGE
    buildAutoComplete();
    buildDistrictDistributionChart();
    buildSchoolTypeCharts();
    buildMap();
    buildTables();


    // METRIC BUTTONS
    $('.metric-buttons .button').click(function () {
      const metric = $(this).data('metric');
      // $('#metric-explainer').html(messages[metric]);
      updateMetrics(metric);
      $('.metric-buttons .button').removeClass('active');
      $(`.metric-buttons .button[data-metric="${metric}"]`).addClass('active');
      $('.selected-metric').text(metric);
    });

    $('.metric-select li').click(function(e) {
      e.preventDefault();
      const metric = $(this).text();
      $('.metric-buttons .button').removeClass('active');
      $(`.metric-buttons .button[data-metric="${metric}"]`).addClass('active');
      $('.selected-metric').text(metric);
      updateMetrics(metric);
    });

  });
}
