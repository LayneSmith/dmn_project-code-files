import mapboxgl from 'mapbox-gl';
import * as d3 from 'd3';
import { getDistrictID, toTitleCase } from './utilities';
import highlightSchool from './highlightSchool';

// ////////////////////////////////////////////////////////////////////////////
// BUILD MAP
// ////////////////////////////////////////////////////////////////////////////

const commaFormat = d3.format(',');

// GET MAP STARTED
const map = new mapboxgl.Map({
  container: 'district-map', // where to put it in DOM
  style: 'https://maps.dallasnews.com/styles.json', // link to custom styles
  maxZoom: 14,
  center: [-96.916519, 32.928455],
  zoom: 8.5,
});

map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
map.scrollZoom.disable();

// re-render our visualization whenever the view changes
// render() will ensure our dots pan and zoom with the map
map.on('viewreset', () => {
  render();
});
map.on('move', () => {
  render();
});

// /////////////////////////////////////////////////////////////////////////////
// SET UP
// /////////////////////////////////////////////////////////////////////////////
// we calculate the scale given mapbox state (derived from viewport-mercator-project's code)
// to define a d3 projection
function getD3() {
  const bbox = document.getElementById('district-map').getBoundingClientRect();
  const center = map.getCenter();
  const zoom = map.getZoom();
  // 512 is hardcoded tile size, might need to be 256 or changed to suit your map config
  const scale = (512) * 0.5 / Math.PI * Math.pow(2, zoom);
  const d3projection = d3.geoMercator()
    .center([center.lng, center.lat])
    .translate([bbox.width / 2, bbox.height / 2])
    .scale(scale);
  return d3projection;
}

function render() {
  // Setting up the d3 element location here pins it to the mapbox coordinates.
  // Everywhere elese you're just adjusting attributes.
  d3projection = getD3();

  // Draw schools
  svg.selectAll('circle.school')
    .attr('cx', (d) => {
      const latlng = d3projection([d.long, d.lat]);
      return latlng[0];
    })
    .attr('cy', (d) => {
      const latlng = d3projection([d.long, d.lat]);
      return latlng[1];
    });
}

const clickPopup = new mapboxgl.Popup();

// /////////////////////////////////////////////////////////////////////////////
// INITIALIZE MAP
// /////////////////////////////////////////////////////////////////////////////
// Setup our svg layer that we can manipulate with d3
const container = map.getCanvasContainer();
// Append svg layer
const svg = d3.select(container).append('svg');
let d3projection = getD3();
const colorScale = d3.scaleOrdinal()
  .domain(['A', 'B', 'C', 'D', 'F'])
  .range(['#329ce8', '#52b033', '#fec44f', '#ff8f24', '#e34e36']);

export function buildMap() {
  // WITH THE DISTRICT, GO RETRIEVE THE ID NUMBER
  const district = $('.district-name-title').text();
  const districtID = getDistrictID(district);
  // Where is this data coming from?
  const districtSchoolData = window.allSchoolData.filter(school => school['District Number'] === districtID);

  // DRAW DOTS FOR EACH SCHOOL
  let school = svg.selectAll('circle.school');
  school.remove();
  school = svg.selectAll('circle.school')
    .data(districtSchoolData);
  school.enter()
    .append('circle')
      .attr('class', d => `school ${d['Campus Number']}`)
      .attr('r', 4)
      .attr('fill', d => colorScale(d['Overall Grade']))
      .attr('opacity', 0.7)
      .on('click', handleClick);

  render();

  const bounds = new mapboxgl.LngLatBounds();
  districtSchoolData.forEach((d) => {
    bounds.extend([d.long, d.lat]);
  });
  map.fitBounds(bounds, { padding: 50 });
}

export function updateMapMetrics(metric) {
  svg.selectAll('circle.school')
  .transition()
    .duration(200)
      .attr('fill', d => colorScale(d[metric]));
}

// /////////////////////////////////////////////////////////////////////////////
// CLICKS
// /////////////////////////////////////////////////////////////////////////////
function handleClick(d){
  const schoolSelected = $(this).attr('class');

  // Highlight on map and bar
  highlightSchool(this, schoolSelected);

  const description = `
    <span class="campus-name">${d['Campus Name']}</span>
    <span class="entry type">${toTitleCase(d['instr_type'])}</span>
    <span class="entry">Enrollment: <strong>${commaFormat(d['Total Number of Students'])} students</strong></span>
    <span class="entry">Grades served: <strong>${d['Grades Served']}</strong></span>

    <span class="entry">% Econ. Disadv.: <strong>${d['% Eco Dis']}%</strong></span>
    <span class="entry">% Limited English: <strong>${d['% LEP Students']}%</strong></span>

    <span class="entry metric" data-metric="Overall Grade">
      <span class="label">Overall performance:</span>
      <span class="grades">
        <span class="grade">A</span>
        <span class="grade">B</span>
        <span class="grade">C</span>
        <span class="grade">D</span>
        <span class="grade">F</span>
      </span>
    </span>

    <span class="entry metric" data-metric="Academic Growth Grade">
      <span class="label">Academic growth:</span>
      <span class="grades">
        <span class="grade">A</span>
        <span class="grade">B</span>
        <span class="grade">C</span>
        <span class="grade">D</span>
        <span class="grade">F</span>
      </span>
    </span>

    <span class="entry metric" data-metric="Relative Performance Grade">
      <span class="label">Relative performance:</span>
      <span class="grades">
        <span class="grade">A</span>
        <span class="grade">B</span>
        <span class="grade">C</span>
        <span class="grade">D</span>
        <span class="grade">F</span>
      </span>
    </span>

    <span class="entry metric" data-metric="Student Achievement Grade">
      <span class="label">Student achievement:</span>
      <span class="grades">
        <span class="grade">A</span>
        <span class="grade">B</span>
        <span class="grade">C</span>
        <span class="grade">D</span>
        <span class="grade">F</span>
      </span>
    </span>

    <span class="entry metric" data-metric="Closing the Gaps Grade">
      <span class="label">Closing the gaps:</span>
      <span class="grades">
        <span class="grade">A</span>
        <span class="grade">B</span>
        <span class="grade">C</span>
        <span class="grade">D</span>
        <span class="grade">F</span>
      </span>
    </span>`;

  clickPopup.remove();
  clickPopup.setLngLat([d.long, d.lat])
    .setHTML(description);
  setTimeout(() => {
    clickPopup.addTo(map);
    $('.mapboxgl-popup .metric').each(function() {
      const metric = $(this).attr('data-metric');
      $(this).find(`.grade:contains(${d[metric]})`).addClass(d[metric].toLowerCase());
    });
  }, 100);

}
