import $ from 'jquery';

// ////////////////////////////////////////////////////////////////////////////
// DROPDOWN MENUS
// ////////////////////////////////////////////////////////////////////////////

$('.metric-select').click(function(e) {
  e.stopPropagation();
  console.log('CLICKED DROPDOWN');
  $(this).toggleClass('active');
});

$(document).click(() => {
  $('.metric-select').removeClass('active');
});
