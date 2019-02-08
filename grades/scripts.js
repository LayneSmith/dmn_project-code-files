import $ from 'jquery';
import { findByLatLng } from './geoLocation';
import { getUrlParams, updateDistrictSpans, cleanDistrictName } from './utilities';
import { buildData } from './buildData';
import './furniture';

// ////////////////////////////////////////////////////////////////////////////
// MAIN SCRIPT
// ////////////////////////////////////////////////////////////////////////////

// WHERE ARE YOU?
let myCoords;
let district;

// Get device coords
function setDeviceCoords(results) {
  myCoords = [results.coords.latitude, results.coords.longitude];
  district = findByLatLng(myCoords);
  updateDistrictSpans(district);
  buildData(district);
}

function useDefault(err) {
  myCoords = [32.7767, -96.7970];
  district = findByLatLng(myCoords);
  updateDistrictSpans(district);
  buildData(district);
}

// GET DISTRICT NAME FROM URL PARAM
const params = getUrlParams(window.location.search);
console.log('DISTRICT', params.district)

if (params.district) {
  console.log('PARAMS FOUND');
  updateDistrictSpans(params.district);
  buildData(params.district);
} else {
  console.log('NO PARAMS FOUND');
  navigator.geolocation.getCurrentPosition(setDeviceCoords, useDefault);
}
