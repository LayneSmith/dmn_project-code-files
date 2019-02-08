import $ from 'jquery';
import { TimelineLite } from 'gsap';

// //////////////////////////////////////////////////////////////////////////
// BUTTONS
// //////////////////////////////////////////////////////////////////////////
$('#showFlippers2008').click(function () {
  // If it's to show democrat leaners
  let party;
  if ($(this).hasClass('flippingLeft')) {
    // Flip name of button
    party = 'Rep';
    $(this).text('Democratic flippers since 2008')
      .removeClass('flippingLeft')
      .addClass('flippingRight');
  } else {
    // Flip name of button
    party = 'Dem';
    $(this).text('Republican flippers since 2008')
      .removeClass('flippingRight')
      .addClass('flippingLeft');
  }
  // Toggle suppression
  $('.all-circles circle').addClass('suppressed');
  $(`.all-circles .flipTo${party}2008 circle`).removeClass('suppressed');
  $(`.all-circles .flipTo${party}2018 circle`).removeClass('suppressed');
  // Tween
  const tl = new TimelineLite()
    .to('.all-trails path', 0.5, { autoAlpha: 0 }) // Hide all trails
    .to(`.all-circles g:not(.flipTo${party}2008) circle`, 0.5, { autoAlpha: 0 }) // Hide all non-flipping circles
    .to(`.all-circles .flipTo${party}2008`, 0.5, { autoAlpha: 1 }, 0) // Show 2018 circles
    .to(`.all-circles .flipTo${party}2008 circle.y2008`, 0.5, { autoAlpha: 1 }, 0) // Show 2008 circles
    .to(`.all-circles .flipTo${party}2008 circle.y2018`, 0.5, { autoAlpha: 1 }, 0) // Show 2018 circles
    .to(`.all-lines path:not(.flipTo${party}2008)`, 0.5, { autoAlpha: 0.0 }, 0) // Hide all paths not flipping
    .to(`.all-lines path.flipTo${party}2008`, 0.5, { autoAlpha: 1 }, 0) // Show flipping paths
    .to('.all-circles circle.y2010', 0.5, { autoAlpha: 0 }) // Hide all non-flipping circles
    .to('.all-circles circle.y2012', 0.5, { autoAlpha: 0 }) // Hide all non-flipping circles
    .to('.all-circles circle.y2014', 0.5, { autoAlpha: 0 }) // Hide all non-flipping circles
    .to('.all-circles circle.y2016', 0.5, { autoAlpha: 0 }); // Hide all non-flipping circles
});


$('#moving').click(function () {
  // If it's to show democrat leaners
  let party;
  let direction;
  if ($(this).hasClass('movingLeft')) {
    // Flip name of button
    party = 'Rep';
    direction = 'Right';
    $(this).text('Counties moving Democratic')
      .removeClass('movingLeft')
      .addClass('movingRight');
  } else {
    // Flip name of button
    party = 'Dem';
    direction = 'Left';
    $(this).text('Counties moving Republican')
      .removeClass('movingRight')
      .addClass('movingLeft');
  }

  // Toggle suppression
  $('.all-circles circle').addClass('suppressed');
  $(`.all-circles .county.moving${direction} circle.y2014`).removeClass('suppressed');
  $(`.all-circles .county.moving${direction} circle.y2018`).removeClass('suppressed');

  const circlesToReveal = $(`.all-circles .county.moving${direction}, .all-circles .county.moving${direction} circle.y2014, .all-circles .county.moving${direction} circle.y2018`);
  const circlesToFade = $(`.all-circles .county:not(.moving${direction}) circle`);

  const showMoving = new TimelineLite()
    .to('.all-trails path', 0.5, { autoAlpha: 0 })

    .to('.all-circles .county circle', 0.5, { autoAlpha: 0.05 }, 0)
    .to(circlesToReveal, 0.5, { autoAlpha: 1 }, 0)
    // .to(circlesToFade, 0.5, { autoAlpha: 0.05 }, 1)
    .to(`.all-lines path:not(.moving${direction})`, 0.5, { autoAlpha: 0.0 }, 0)
    .to(`.all-lines path.moving${direction}`, 0.5, { autoAlpha: 1 }, 0)

    .to('.dem-counts', 0.5, { autoAlpha: 0 }, 0)
    .to('.rep-counts', 0.5, { autoAlpha: 0 }, 0)
    .to('.counties.dem', 0.5, { autoAlpha: 0 }, 0)
    .to('.counties.rep', 0.5, { autoAlpha: 0 }, 0);
});
