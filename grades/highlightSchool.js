import $ from 'jquery';

// ////////////////////////////////////////////////////////////////////////////
// TOGGLE SELECTED SCHOOLS
// ////////////////////////////////////////////////////////////////////////////

export default function highlightSchool(schoolClicked, schoolID) {
  const id = schoolID.split(' ')[1];
  $('circle.selected').removeClass('selected');
  $('line.selected').removeClass('selected');
  $(`.${id}`).addClass('selected');

}
