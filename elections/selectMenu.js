import $ from 'jquery';
import { displaySelectedCounty } from './utilities';
import { TweenMax, TimelineLite } from 'gsap';
import regions from './tx-regions';
import 'selectize';

// ////////////////////////////////////////////////////////////////////////////
// SELECTIZE
// ////////////////////////////////////////////////////////////////////////////

export function buildSelectMenus(data) {
  data.forEach((d) => {
    const string = `<option value="${d.fips}">${d.county}</option>`;
    $('#select-county').append(string);
  });

  $('#select-county').selectize({
    onChange: (value) => {
      displaySelectedCounty(value);
    },
  });
}
