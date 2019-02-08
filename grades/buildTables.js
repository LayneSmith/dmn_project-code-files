import $ from 'jquery';
import * as d3 from 'd3';
import { getDistrictID } from './utilities';

require('datatables.net-dt')();
require('datatables.net-responsive-dt')();

// ////////////////////////////////////////////////////////////////////////////
// DATATABLES IMPLEMENTATION
// ////////////////////////////////////////////////////////////////////////////

const commaFormat = d3.format(',');

const DataTable = require('datatables.net-zf')();

// BUILDING ELEMENTARY TABLE
export default function buildTables() {
  // WITH THE DISTRICT, GO RETRIEVE THE ID NUMBER
  const district = $('.district-name-title').text();
  const districtID = getDistrictID(district, window.districtEnrollments);
  // Where is this data coming from?
  const districtSchoolData = window.allSchoolData.filter(school => school['District Number'] === districtID);

  districtSchoolData.map((d) => {
    if (isNaN(d['Overall Score'])) { d['Overall Score'] = '*'; }
    if (d['Overall Grade'] === 'N/A') { d['Overall Grade'] = '*'; }
    if (isNaN(d['Academic Growth Score'])) { d['Academic Growth Score'] = '*'; }
    if (d['Academic Growth Grade'] === 'N/A') { d['Academic Growth Grade'] = '*'; }
    if (isNaN(d['Relative Performance Score'])) { d['Relative Performance Score'] = '*'; }
    if (d['Relative Performance Grade'] === 'N/A') { d['Relative Performance Grade'] = '*'; }
    if (isNaN(d['Student Achievement Score'])) { d['Student Achievement Score'] = '*'; }
    if (d['Student Achievement Grade'] === 'N/A') { d['Student Achievement Grade'] = '*'; }
    if (isNaN(d['Closing the Gaps Score'])) { d['Closing the Gaps Score'] = '*'; }
    if (d['Closing the Gaps Grade'] === 'N/A') { d['Closing the Gaps Grade'] = '*'; }
  })

  const tableHeadHTML = `
    <thead>
      <tr>
        <th> Campus </th>
        <th> Enrollment </th>
        <th> Economically Disadvantaged </th>
        <th> Overall Performance Score</th>
        <th> Academic Growth Score</th>
        <th> Relative Performance Score</th>
        <th> Student Achievement Score</th>
        <th> Closing the Gaps Score</th>
      </tr>
    </thead>
  `;

  let elementaryHTML;
  let middleHTML;
  let highHTML;

  // ELEMENTARIES
  const elementaries = districtSchoolData.filter(d => d['School Type'] === 'Elementary');
  elementaries.forEach((school) => {
    elementaryHTML += `
    <tr>
      <td>${school['Campus Name']}</td>
      <td>${commaFormat(school['Total Number of Students'])}</td>
      <td>${school['% Eco Dis']}%</td>
      <td>${school['Overall Score']}/${school['Overall Grade']}</td>
      <td>${school['Academic Growth Score']}/${school['Academic Growth Grade']}</td>
      <td>${school['Relative Performance Score']}/${school['Relative Performance Grade']}</td>
      <td>${school['Student Achievement Score']}/${school['Student Achievement Grade']}</td>
      <td>${school['Closing the Gaps Score']}/${school['Closing the Gaps Grade']}</td>
    </tr>
    `;
  });
  $('#elementary-table').html(tableHeadHTML + elementaryHTML);

  // MIDDLE
  const middles = districtSchoolData.filter(d => d['School Type'] === 'Middle School');
  middles.forEach((school) => {
    middleHTML += `
    <tr>
      <td>${school['Campus Name']}</td>
      <td>${commaFormat(school['Total Number of Students'])}</td>
      <td>${school['% Eco Dis']}%</td>
      <td>${school['Overall Score']}/${school['Overall Grade']}</td>
      <td>${school['Academic Growth Score']}/${school['Academic Growth Grade']}</td>
      <td>${school['Relative Performance Score']}/${school['Relative Performance Grade']}</td>
      <td>${school['Student Achievement Score']}/${school['Student Achievement Grade']}</td>
      <td>${school['Closing the Gaps Score']}/${school['Closing the Gaps Grade']}</td>
    </tr>
    `;
  });
  $('#middle-table').html(tableHeadHTML + middleHTML);

  // HIGH SCHOOL
  const highs = districtSchoolData.filter(d => d['School Type'] === 'High School');
  highs.forEach((school) => {
    highHTML += `
    <tr>
      <td>${school['Campus Name']}</td>
      <td>${commaFormat(school['Total Number of Students'])}</td>
      <td>${school['% Eco Dis']}%</td>
      <td>${school['Overall Score']}/${school['Overall Grade']}</td>
      <td>${school['Academic Growth Score']}/${school['Academic Growth Grade']}</td>
      <td>${school['Relative Performance Score']}/${school['Relative Performance Grade']}</td>
      <td>${school['Student Achievement Score']}/${school['Student Achievement Grade']}</td>
      <td>${school['Closing the Gaps Score']}/${school['Closing the Gaps Grade']}</td>
    </tr>
    `;
  });
  $('#high-table').html(tableHeadHTML + highHTML);


  // ACTIVATE TABLES
  const table = $('table.display').DataTable({
    destroy: true,
    responsive: true,
    paging: true,
    order: [[1, 'desc']],
    lengthMenu: [[5, 10, 25, -1], [5, 10, 25, 'All']],
    scrollX: true,
    pageLength: 10,
    columnDefs: [
      {
        targets: [0],
        width: '20%',
      },
      {
        targets: [1, 2, 3, 4, 5, 6, 7],
        className: 'dt-body-center',
      },
    ],
  });
}
