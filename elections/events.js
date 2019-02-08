import $ from 'jquery';
import 'selectize';
import regions from './tx-regions';

// ////////////////////////////////////////////////////////////////////////////
// EVENT CALLBACKS
// ////////////////////////////////////////////////////////////////////////////

export function highlightRegionsOnThumb(region) {
  $('#thumbTX g .thumb-county').removeClass('active');
  // console.log('TARGETS', targets);
  if (region != 'All regions') {
    const targets = regions[region];
    targets.forEach((county) => {
      // console.log('COUNTY', county);
      $(`#thumbTX g .c${county}`).addClass('active');
    });
  } else {
    const tl = new TimelineLite()
      .to('.all-circles g.county', 0.5, { autoAlpha: 1 }) // Reveal all counties
      .to('.all-circles g.county circle', 0.5, { autoAlpha: 1 }, 0) // Reveal all counties
      .to('.all-trails path', 0.5, { autoAlpha: 0 }, 0); // Hide all trails
  }
}

function displayRegion(rgn) {
  $('.all-counties g circle').addClass('suppressed');

  // Highlight thumbnail map
  highlightRegionsOnThumb(rgn);

  // If All regions
  if (rgn === 'All regions') {
    // Add length to display type
    $('.dem-counts').text($('.all-circles g.county circle.democrat.y2018').length);
    $('.rep-counts').text($('.all-circles g.county circle.republican.y2018').length);
    // Remove all suppression
    $('.all-circles circle').removeClass('suppressed');
    // Tweens
    const tl = new TimelineLite()
      .to('.all-circles g.county', 0.5, { autoAlpha: 1 }) // Reveal all counties
      .to('.all-trails path', 0.5, { autoAlpha: 0 }, 0); // Hide all trails
  } else {
    // If it's a county number
    const regnLC = rgn.toLowerCase().replace(' ', ''); // convert to slug
    // Add length to display type
    $('.dem-counts').text($(`.all-circles g.${regnLC} circle.democrat.y2018`).length);
    $('.rep-counts').text($(`.all-circles g.${regnLC} circle.republican.y2018`).length);
    // Remove suppression from circles in our region
    $(`.all-circles g.${regnLC} circle.y2018`).removeClass('suppressed');
    // Let jquery select our elements because gsap can't get it right sometimes.
    let fadeIns;
    // If this is the playground select, do something different.
    if (window.playground) {
      fadeIns = $(`.chartWrapper g.${regnLC} circle`);
    } else {
      fadeIns = $(`.chartWrapper g.${regnLC} circle.y2018`);
    }
    const fadeOuts = $(`.chartWrapper .county:not(.${regnLC}) circle`); // Fade anything not in our region
    // Tween
    const tl = new TimelineLite()
      .to(fadeIns, 0.5, { autoAlpha: 1 }) // Fade in our region's circles
      .to(fadeOuts, 0.5, { autoAlpha: 0.05 }, 0) // Fade out everybody else
      .to('.all-trails path', 0.5, { autoAlpha: 0 }, 0); // Fade out trails in case we're scrolling up from below.
  }
}

$('#select-region1').selectize({
  maxOptions: 8,
  onChange: (value) => {
    displayRegion(value);
  },
});

$('#select-region2').selectize({
  maxOptions: 8,
  onChange: (value) => {
    displayRegion(value);
  },
});
