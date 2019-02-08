import * as topojson from 'topojson-client';
import * as turf from '@turf/turf';
import districts from './districts';

// ////////////////////////////////////////////////////////////////////////////
// USE LOCATION TO RETURN DISTRICT
// ////////////////////////////////////////////////////////////////////////////

export function findByLatLng(coordinates) {
  const long = parseFloat(coordinates[1]);
  const lat = parseFloat(coordinates[0]);
  const point = turf.point([long, lat]);

  let districtKey;

  const keys = Object.keys(districts.objects);
  const geo = topojson.feature(districts, districts.objects[keys[0]]);
  geo.features.forEach((k, i) => {
    const searchWithin = turf.multiPolygon([[k.geometry.coordinates[0]]]);
    const ptsWithin = turf.pointsWithinPolygon(point, searchWithin);
    if (ptsWithin.features.length > 0) {
      districtKey = i;
    }
  });

  const geoDistrict = geo.features[districtKey].properties.NAME.toUpperCase();
  return geoDistrict;
}
