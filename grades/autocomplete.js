import './jquery-ui-1.10.4.custom.min';
import { updateDistrictSpans, toTitleCase } from './utilities';
import { buildSchoolTypeCharts } from './buildSchoolTypeCharts';
import { buildMap } from './maps';
import buildDistrictDistributionChart from './buildGradeDistributionHorizontalChart';
import buildTables from './buildTables';

// ////////////////////////////////////////////////////////////////////////////
// BUILD AUTOCOMPLETE FUNCTIONALITY
// ////////////////////////////////////////////////////////////////////////////

export default function buildAutoComplete() {

  // Create array to hold possible options
  const options = [];
  window.districtEnrollments.forEach((d) => {
    options.push(toTitleCase(d['District Name']));
  });

  // Get unique values from that array
  const uniques = [...new Set(options)];

  // Activate jQuery UI's autocomplete
  $('#district-input').autocomplete({
    source: uniques, // Options
    select: (event, ui) => { // Execution
      const selectedDistrict = ui.item.value;
      $('.metric-select .selected-metric').text('Overall Performance');
      $('.metric-buttons .button').removeClass('active');
      $('.metric-buttons .button[data-metric="Overall Performance"]').addClass('active');
      updateDistrictSpans(selectedDistrict);
      buildDistrictDistributionChart();
      buildSchoolTypeCharts();
      buildMap();
      buildTables();
    },
  });
}
