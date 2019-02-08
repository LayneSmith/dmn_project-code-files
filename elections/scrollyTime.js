import $ from 'jquery';
import ScrollMagic from 'scrollmagic';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
import 'selectize';
import { TweenMax, TimelineLite } from 'gsap';
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators';

// ////////////////////////////////////////////////////////////////////////////
// SCROLLMAGIC SCENES THAT SETPINS AND WATCH PAGE SCROLL EVENTS
// ////////////////////////////////////////////////////////////////////////////

export function buildScrollyTime() {

  // Controller holds all the scenes
  const controller = new ScrollMagic.Controller({ addIndicators: false });

  // Set the opacity manually for the following elements
  TweenMax.set('.all-circles circle:not(.y2018)', { autoAlpha: 0 });
  TweenMax.set('.all-trails path', { autoAlpha: 0 });
  TweenMax.set('.all-lines path', { autoAlpha: 0 });

  // This will be the timeline that holds all the tweens
  let tl = new TimelineLite();


  // //////////////////////////////////////////////////////////////////////////
  // 1. STICK CHART TO VIEWPORT
  // //////////////////////////////////////////////////////////////////////////
  const smStickChart = new ScrollMagic.Scene({
    triggerElement: '#turnout-trigger',
    triggerHook: 0, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
  })
  .setPin('#election-turnout')
  .duration($('#election-turnout').height() * $('.callout-container').length) // Percentage of full screen or hard-wired number of pixels
  .addTo(controller);


  // //////////////////////////////////////////////////////////////////////////
  // 2. SHOW ALL
  // //////////////////////////////////////////////////////////////////////////
  const reveal2018 = new ScrollMagic.Scene({
    triggerElement: '#reveal2018',
    triggerHook: 0.9,
    duration: '100%',
  })
  .on('enter', () => { // When scene starts, suppress democrat hovers
    $('.tooltip').removeClass('active');
    $('.all-circles circle.y2018').removeClass('suppressed');
    tl.clear();
    tl.to('.all-circles circle.y2018', 0.5, { autoAlpha: 1 })
      .to('.dem-counts', 0.5, { autoAlpha: 1 }, 0)
      .to('.rep-counts', 0.5, { autoAlpha: 1 }, 0);
  })
  .addTo(controller);


  // //////////////////////////////////////////////////////////////////////////
  // 3. HIDE DEMOCRATS
  // //////////////////////////////////////////////////////////////////////////
  const hideDemocrats = new ScrollMagic.Scene({
    triggerElement: '#hideDemocrats',
    triggerHook: 0.9, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
    duration: '100%',
  })
  .on('enter', () => { // When scene starts, suppress democrat hovers
    $('.tooltip').removeClass('active');
    $('.all-circles circle').addClass('suppressed');
    $('.all-circles circle.republican.y2018').removeClass('suppressed');
    tl.clear();
    tl.to('.all-circles circle.democrat.y2018', 0.5, { autoAlpha: 0.05 })
      .to('.all-circles circle.republican.y2018', 0.5, { autoAlpha: 1 }, 0)
      .to('.dem-counts', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.counties.dem', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.rep-counts', 0.5, { autoAlpha: 1 }, 0);
  })
  .on('leave', () => {
    $('.all-circles circle').addClass('suppressed');
  })
  .addTo(controller);


  // //////////////////////////////////////////////////////////////////////////
  // 4. HIDE REPS SHOW DEMS
  // //////////////////////////////////////////////////////////////////////////
  const hideDemShowRep = new ScrollMagic.Scene({
    triggerElement: '#fadeInDemsFadeOutReps',
    triggerHook: 0.9, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
    duration: '100%',
  })
  .on('enter', () => { // When starts, animate dems/reps, hide counts
    $('.tooltip').removeClass('active');
    $('.all-circles circle').addClass('suppressed');
    $('.all-circles circle.democrat.y2018').removeClass('suppressed');
    $('.dem-counts').text($('#chart circle.democrat.y2018').length);
    $('.rep-counts').text($('#chart circle.republican.y2018').length);
    tl.clear();
    tl.to('.all-circles circle.democrat.y2018', 0.5, { autoAlpha: 1 })
      .to('.all-circles circle.republican.y2018', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.dem-counts', 0.5, { autoAlpha: 1 }, 0)
      .to('.rep-counts', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.counties.rep', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.counties.dem', 0.5, { autoAlpha: 1 }, 0);
    $('#thumbTX path').removeClass('active');
  })
  .on('leave', () => {
    $('.all-circles circle').addClass('suppressed');
  })
  .addTo(controller);


  // //////////////////////////////////////////////////////////////////////////
  // 5. HIDE DEMS SHOW NORTH TEXAS
  // //////////////////////////////////////////////////////////////////////////
  const hideDemShowNorthTexas = new ScrollMagic.Scene({
    triggerElement: '#fadeOutDemsFadeInNorthTexas2018',
    triggerHook: 0.9, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
    duration: '100%',
  })
  .on('enter', () => { // Fade in northtexas and counts
    $('.tooltip').removeClass('active'); // Hide tooltip
    $('.all-circles circle').addClass('suppressed'); // Suppress all circles
    // Update the displays at the top of the page
    $('.dem-counts').text($('#chart .northtexas circle.democrat.y2018 ').length);
    $('.rep-counts').text($('#chart .northtexas circle.republican.y2018').length);
    // Get region slug
    const thisRegion = $('#select-region1 option').text().toLowerCase().replace(' ', '');
    $(`.all-circles g.${thisRegion} circle.y2018`).removeClass('suppressed'); // Suppress all circles
    // $('#thumbTX path.thumb-county').removeClass('active');
    $(`#thumbTX g .${thisRegion}`).addClass('active');
    const fadeIns = $(`.all-circles g.${thisRegion} circle.y2018`); //
    const fadeOuts = $(`.all-circles g:not(.${thisRegion}) circle`);
    const fadeOuts2 = $(`.all-circles g.${thisRegion} circle:not(.y2018)`);
    tl.clear();
    tl.to(fadeOuts, 0.5, { autoAlpha: 0.05 })
      .to(fadeOuts2, 0.5, { autoAlpha: 0.05 }, 0)
      .to(fadeIns, 0.5, { autoAlpha: 1 }, 0)
      .to('.dem-counts', 0.5, { autoAlpha: 1 }, 0)
      .to('.counties.dem', 0.5, { autoAlpha: 1 }, 0)
      .to('.rep-counts', 0.5, { autoAlpha: 1 }, 0)
      .to('.counties.rep', 0.5, { autoAlpha: 1 }, 0);
  })
  .on('leave', () => {
    $('.all-circles circle').addClass('suppressed');
  })
  .addTo(controller);


  // //////////////////////////////////////////////////////////////////////////
  // 6. SHOW EVERY RACE
  // //////////////////////////////////////////////////////////////////////////
  const everyRace = new ScrollMagic.Scene({
    triggerElement: '#everyRace',
    triggerHook: 0.9, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
    duration: '100%',
  })
  .on('enter', () => {
    $('.tooltip').removeClass('active');
    $('.all-circles circle').removeClass('suppressed');
    $('#thumbTX path.thumb-county').removeClass('active');
    tl.clear();
    tl.to('.all-trails path', 0.5, { autoAlpha: 0 })
      .to('.all-circles g', 0.5, { autoAlpha: 1 })
      .to('.all-circles g circle', 0.5, { autoAlpha: 1 }, 0)
      .to('.dem-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.rep-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.dem', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.rep', 0.5, { autoAlpha: 0 }, 0);
  })
  .reverse(true)
  .addTo(controller);


  // //////////////////////////////////////////////////////////////////////////
  // 7. SHOW DALLAS COUNTY
  // //////////////////////////////////////////////////////////////////////////
  const showDallasCounty = new ScrollMagic.Scene({
    triggerElement: '#showDallasCounty',
    triggerHook: 0.9, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
    duration: '100%',
  })
  .on('enter', () => {
    $('.tooltip').removeClass('active'); // Remove tooltip
    $('.all-circles circle').addClass('suppressed'); // Suppress all circles
    $('.all-circles .c48113 circle').removeClass('suppressed'); // Release Dallas county circle
    // Tween
    tl.clear();
    tl.to('.all-trails path:not(.c48113)', 0.5, { autoAlpha: 0 }) // Hide all trails but Dallas
      .to('.all-trails path.c48113', 0.5, { autoAlpha: 1 }, 0) // Make sure trail is visible
      .to('.all-circles g.county:not(.c48113)', 0.5, { autoAlpha: 0.05 }, 0) // Hide all circles but Dallas
      .to('.all-circles g.c48113', 0.5, { autoAlpha: 1 }, 0); // Make sure Dallas circle is visible
  })
  .addTo(controller);

  // //////////////////////////////////////////////////////////////////////////
  // 8. SHOW SUBURBS
  // //////////////////////////////////////////////////////////////////////////
  const showDallasSuburbs = new ScrollMagic.Scene({
    triggerElement: '#showDallasSuburbs',
    triggerHook: 0.9, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
    duration: '100%',
  })
  .on('enter', () => {
    $('.tooltip').removeClass('active');
    $('.all-circles circle').addClass('suppressed');
    $('.all-circles g.c48085 circle, .all-circles g.c48121 circle, .all-circles g.c48139 circle, .all-circles g.c48257 circle, .all-circles g.c48397 circle, .all-circles g.c48113 circle').removeClass('suppressed');
    const trailsToHide = $('.all-trails path:not(.c48085, .c48121, .c48139, .c48257, .c48397, .c48113)');
    const circlesToHide = $('.all-circles g.county:not(.c48085, .c48121, .c48139, .c48257, .c48397, .c48113) circle');
    tl.clear();
    tl.to('.all-trails path', 0.5, { autoAlpha: 0 })
      .to(trailsToHide, 0.5, { autoAlpha: 0 })
      .to(circlesToHide, 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48085', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48121', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48139', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48257', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48397', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48113', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48085 circle', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48121 circle', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48139 circle', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48257 circle', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48397 circle', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48113 circle', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-trails path.c48085', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-trails path.c48121', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-trails path.c48139', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-trails path.c48257', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-trails path.c48397', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-trails path.c48113', 0.5, { autoAlpha: 1 }, 0)
      .to('.dem-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.rep-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.dem', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.rep', 0.5, { autoAlpha: 0 }, 0)
      .to('.all-circles g.c48439 circle', 0.5, { autoAlpha: 0 }, 0);
  })
  .addTo(controller);

  // //////////////////////////////////////////////////////////////////////////
  // 9. SHOW TARRANT COUNTY
  // //////////////////////////////////////////////////////////////////////////
  const showTarrantCounty = new ScrollMagic.Scene({
    triggerElement: '#showTarrantCounty',
    triggerHook: 0.9, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
    duration: '100%',
  })
  .on('enter', () => {
    $('.tooltip').removeClass('active');
    $('.all-circles g').children().addClass('suppressed');
    $('.all-circles .c48439').children().removeClass('suppressed');
    tl.clear();
    tl.to('.all-lines path', 0.5, { autoAlpha: 0 })
      .to('.all-trails path:not(.c48439)', 0.5, { autoAlpha: 0 }, 0)
      .to('.all-trails path.c48439', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.county:not(.c48439)', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-circles g.c48439', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g.c48439 circle', 0.5, { autoAlpha: 1 }, 0);
  })
  .addTo(controller);

  // //////////////////////////////////////////////////////////////////////////
  // 10. SHOW DEM FLIPPERS SINCE 2008
  // //////////////////////////////////////////////////////////////////////////
  const showDemFlippers2008 = new ScrollMagic.Scene({
    triggerElement: '#showDemFlippers2008',
    triggerHook: 0.9, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
    duration: '100%',
  })
  .on('enter', () => {
    $('.tooltip').removeClass('active'); // Remove tooltip
    $('.all-circles circle').addClass('suppressed');
    $('.all-circles .flipToDem2008 circle.y2008').removeClass('suppressed');
    $('.all-circles .flipToDem2008 circle.y2018').removeClass('suppressed');
    tl.clear();
    tl.to('.all-trails path', 0.5, { autoAlpha: 0 })
      .to('.all-lines path', 0.5, { autoAlpha: 0.0 }, 0)
      .to('.all-lines path.flipToDem2008', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles g:not(.flipToDem2008)', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-circles .flipToDem2008', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles .flipToDem2008 circle:not(.y2008, .y2018)', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-circles .flipToDem2008 circle.y2008', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles .flipToDem2008 circle.y2018', 0.5, { autoAlpha: 1 }, 0)
      .to('.dem-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.rep-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.dem', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.rep', 0.5, { autoAlpha: 0 }, 0);
  })
  .addTo(controller);


  // //////////////////////////////////////////////////////////////////////////
  // 11. SHOW DEM FLIPEPRS SINCE 2014
  // //////////////////////////////////////////////////////////////////////////
  const showDemFlippers2014 = new ScrollMagic.Scene({
    triggerElement: '#showDemFlippers2014',
    triggerHook: 0.9, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
    duration: '100%',
  })
  .on('enter', () => {
    $('.tooltip').removeClass('active');
    $('.all-circles g').children().addClass('suppressed');
    $('.all-circles .flipToDem2014 .y2014').removeClass('suppressed');
    $('.all-circles .flipToDem2014 .y2018').removeClass('suppressed');
    tl.clear();
    tl.to('.all-trails path', 0.5, { autoAlpha: 0 })
      .to('.all-circles g:not(.flipToDem2014)', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-circles circle.y2008', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-circles circle.y2010', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-circles circle.y2012', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-circles circle.y2016', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-circles .flipToDem2014', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles .flipToDem2014 circle.y2014', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles .flipToDem2014 circle.y2018', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-lines path:not(.flipToDem2014)', 0.5, { autoAlpha: 0.0 }, 0)
      .to('.all-lines path.flipToDem2014', 0.5, { autoAlpha: 1 }, 0)
      .to('.dem-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.rep-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.dem', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.rep', 0.5, { autoAlpha: 0 }, 0);
  })
  .addTo(controller);

  // //////////////////////////////////////////////////////////////////////////
  // 12. SHOW EVERY COUNTY MOVING LEFT SINCE 2008
  // //////////////////////////////////////////////////////////////////////////
  const showLeftLeaning = new ScrollMagic.Scene({
    triggerElement: '#showLeftLeaning',
    triggerHook: 0.9, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
    duration: '100%',
  })
  .on('enter', () => {
    $('.tooltip').removeClass('active');
    $('.all-circles g').children().addClass('suppressed');
    $('.all-circles .movingLeft .y2014').removeClass('suppressed');
    $('.all-circles .movingLeft .y2018').removeClass('suppressed');
    tl.clear();
    tl.to('.all-trails path', 0.5, { autoAlpha: 0 })
      .to('.all-circles g:not(.movingLeft)', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-circles .movingLeft', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles .movingLeft circle.y2014', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles .movingLeft circle.y2018', 0.5, { autoAlpha: 1 }, 0)
      .to('.all-circles .movingLeft circle.y2008', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-circles .movingLeft circle.y2010', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-circles .movingLeft circle.y2012', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-circles .movingLeft circle.y2016', 0.5, { autoAlpha: 0.05 }, 0)
      .to('.all-lines path:not(.movingLeft)', 0.5, { autoAlpha: 0.0 }, 0)
      .to('.all-lines path.movingLeft', 0.5, { autoAlpha: 1 }, 0)
      .to('.dem-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.rep-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.dem', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.rep', 0.5, { autoAlpha: 0 }, 0);
  })
  .on('end', () => {
    console.log('Slide down UI');
  })
  .addTo(controller);

  // ////////////////////////////////////////////////////////////////////////////
  // TRANSITION ALL
  // ////////////////////////////////////////////////////////////////////////////

  window.playground = false;

  const showPlayground = new ScrollMagic.Scene({
    triggerElement: '#playground',
    triggerHook: 0.5, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
    duration: '125%',
  })
  .on('enter', () => {
    window.playground = true;
    $('.tooltip').removeClass('active');
    $('.all-circles g').children().removeClass('suppressed');
    tl.clear();
    tl.to('.all-trails path', 0.5, { autoAlpha: 0 })
      .to('.all-lines path', 0.5, { autoAlpha: 0 }, 0)
      .to('.all-circles .county circle', 0.5, { autoAlpha: 1 }, 0)
      .to('.dem-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.rep-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.dem', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.rep', 0.5, { autoAlpha: 0 }, 0);
    $('.controls').animate({
      top: 0,
    }, 500);
  })
  .on('leave', () => {
    window.playground = false;
    $('.controls').animate({
      top: -55,
    }, 500);
  })
  .addTo(controller);

  const showLast = new ScrollMagic.Scene({
    triggerElement: '#last-container',
    triggerHook: 0.5, // 1 onEnter, .5 onCenter (Defualt), 0 onLeave
    duration: '125%',
  })
  .on('enter', () => {
    window.playground = true;
    $('.tooltip').removeClass('active');
    $('.all-circles g').children().removeClass('suppressed');
    tl.clear();
    tl.to('.all-trails path', 0.5, { autoAlpha: 0 })
      .to('.all-lines path', 0.5, { autoAlpha: 0 }, 0)
      .to('.all-circles .county circle', 0.5, { autoAlpha: 1 }, 0)
      .to('.dem-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.rep-counts', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.dem', 0.5, { autoAlpha: 0 }, 0)
      .to('.counties.rep', 0.5, { autoAlpha: 0 }, 0);
    $('.controls').animate({
      top: 0,
    }, 500);
  })
  .on('leave', () => {
    window.playground = false;
    $('.controls').animate({
      top: -55,
    }, 500);
  })
  .addTo(controller);
}
