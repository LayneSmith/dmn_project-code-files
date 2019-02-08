import $ from 'jquery';

// ////////////////////////////////////////////////////////////////////////////
// CLEAN DISTRICT NAMES
// ////////////////////////////////////////////////////////////////////////////
export function cleanDistrictName(queries) {
  // decode unicode characters
  const cleanQueries = queries.replace('%3D', '=');
  // pluck the school name from the parameters
  let targetDistrict = /district=([^&]+)/.exec(cleanQueries)[1];
  // replace any special characters in the school name with common text equivalents
  targetDistrict = targetDistrict.replace('_', ' ');
  targetDistrict = targetDistrict.replace('%26', '&');
  // return the school name
  return targetDistrict;
}

// ////////////////////////////////////////////////////////////////////////////
// GET URL PARAMATERS
// ////////////////////////////////////////////////////////////////////////////
export function getUrlParams(search) {
  function parseVar(str) {
    return `${toTitleCase(str)}`;
  }
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  const params = {};
  hashes.map((hash) => {
    const [key, val] = hash.split('=');
    params[key] = parseVar(decodeURIComponent(val));
  });
  return params;
}

// ////////////////////////////////////////////////////////////////////////////
// CONVERT STRING TO TITLE CASE
// ////////////////////////////////////////////////////////////////////////////
export function toTitleCase(str) {
  // console.group('toTitleCase()')
  const strArray = str.toLowerCase().split(' ');
  strArray.forEach((k, i) => {
    strArray[i] = k.charAt(0).toUpperCase() + k.slice(1);
  });
  let joined = strArray.join(' ');
  if (joined.includes(' isd')) {
    joined = joined.replace(' isd', ' ISD');
  }
  if (joined.includes(' Isd')) {
    joined = joined.replace(' Isd', ' ISD');
  }
  if (joined.includes(' cisd')) {
    joined = joined.replace(' isd', ' CISD');
  }
  if (joined.includes(' Cisd')) {
    joined = joined.replace(' Isd', ' CISD');
  }
  const strArray2 = joined.split('-');
  strArray2.forEach((k, i) => {
    strArray2[i] = k.charAt(0).toUpperCase() + k.slice(1);
  });
  let joined2 = strArray2.join('-');
  // console.groupEnd()

  return joined2;
}

// ////////////////////////////////////////////////////////////////////////////
// CONVERT SCORE TO GRADES
// ////////////////////////////////////////////////////////////////////////////
export function getLetterGrade(nbr) {
  if (nbr >= 50 && nbr < 60) { return 'F'; }
  if (nbr >= 60 && nbr < 70) { return 'D'; }
  if (nbr >= 70 && nbr < 80) { return 'C'; }
  if (nbr >= 80 && nbr < 90) { return 'B'; }
  if (nbr >= 90 && nbr <= 100) { return 'A'; }
  return 'N/A';
}

// ////////////////////////////////////////////////////////////////////////////
// GET RANDOM NUMBER BETWEEN TWO INTEGERS
// ////////////////////////////////////////////////////////////////////////////
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min); // The maximum is exclusive and the minimum is inclusive
}

// ////////////////////////////////////////////////////////////////////////////
// JITTER VERTICAL LINES’ XLOC BASED ON CHART WIDTH
// ////////////////////////////////////////////////////////////////////////////
export function jitter(pixelLocation) {
  const boxWidth = Math.floor($('.snapshot-chart-schools').width() / 50);
  const px = Math.round(pixelLocation);
  const plusMinus = boxWidth / 2;
  const low = px - plusMinus;
  const high = px + plusMinus;
  const jitteredValue = getRandomInt(low, high);
  return jitteredValue;
}

// ////////////////////////////////////////////////////////////////////////////
// RETRIEVE DISTRICT IDS
// ////////////////////////////////////////////////////////////////////////////
export function getDistrictID(district) {
  const filtered = window.districtEnrollments.filter(d => d['District Name'] === district.toUpperCase())[0];
  return filtered['District Number'];
}

// ////////////////////////////////////////////////////////////////////////////
// UPDATE DISTRICT SPANS
// ////////////////////////////////////////////////////////////////////////////
export function updateDistrictSpans(district) {
  const cleaned = toTitleCase(district);
  $('.district-name-title').text(toTitleCase(district));
  $('.district-name-chart').text(toTitleCase(district));
  $('.district-name-head').html(`A look at <span class="district-name-chart">${toTitleCase(district)}</span>`);
}

// ////////////////////////////////////////////////////////////////////////////
// GET DISTRICT SIZE
// ////////////////////////////////////////////////////////////////////////////
export function getDistrictSize(districtID) {
  const result = window.districtEnrollments.filter(d => d['District Number'] === districtID)[0];
  return result['District Size'];
}
