import $ from 'jquery';
import * as d3 from 'd3';
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
import { TweenMax, TimelineLite } from 'gsap';
import races from './yearly-results';
import { highlightThumbnail } from './utilities';

const pctFormat = d3.format('.1%');
const addCommas = d3.format(',');

// ////////////////////////////////////////////////////////////////////////////
// POPULATE TOOLTIP
// ////////////////////////////////////////////////////////////////////////////
export function populateTooltip(results, year) {
  const contentArray = [
    {
      party: 'R',
      candidate: races[year].rep_candidate,
      score: results[`rep_pct_${year}`],
    },
    {
      party: 'D',
      candidate: races[year].dem_candidate,
      score: results[`dem_pct_${year}`],
    },
    {
      party: 'L',
      candidate: races[year].lib_candidate,
      score: results[`lib_pct_${year}`],
    },
  ];

  contentArray.sort((a, b) => b.score - a.score);

  const html = `
    <div class='content'>
      <table style="width:100%">

        <col width="20">
        <col width="150">
        <col width="25">

        <tr>
          <td colspan="3"><strong>${results.county} County</strong></td>
        </tr>

        <tr class='race'>
          <td colspan="3">${year} | ${races[year].race} </td>
        </tr>

        <tr>
          <td><span class="${contentArray[0].party.toLowerCase()}">${contentArray[0].party}</span></td>
          <td>${contentArray[0].candidate}</td>
          <td>${pctFormat(contentArray[0].score)}</td>
        </tr>

        <tr>
          <td><span class="${contentArray[1].party.toLowerCase()}">${contentArray[1].party}</span></td>
          <td>${contentArray[1].candidate}</td>
          <td>${pctFormat(contentArray[1].score)}</td>
        </tr>

        <tr>
          <td><span class="${contentArray[2].party.toLowerCase()}">${contentArray[2].party}</span></td>
          <td>${contentArray[2].candidate}</td>
          <td>${pctFormat(contentArray[2].score)}</td>
        </tr>

        <tr class="turnout">
          <td colspan="3">Turnout: ${pctFormat(results[`turnout_${year}`])} of ${addCommas(results[`total_voters_${year}`])} voters</td>
        </tr>
      </table>
    </div>
  `;
  return html;
}

export function buildToolTip(data, yr) {
  // const thisCircle = $(this);

  if (window.playground) {
    const thisTrail = $(`.all-trails .c${data.fips}`);
    const tl = new TimelineLite();
    tl.to('.all-trails path', 0.5, { autoAlpha: 0 });
    tl.to(thisTrail, 0.5, { autoAlpha: 1 }, 0);
  }

  let year;
  if (!yr) {
    year = $(this).attr('class').split(' ')[1].slice(-4);
  } else {
    year = yr;
  }

  const thisCircle = $(`.all-circles .c${data.fips} circle.y${year}`);

  const tooltipWidth = $('.tooltip').outerWidth();
  const tooltipHeight = $('.tooltip').outerHeight();

  // Highlight THUMBNAIL
  highlightThumbnail(data, thisCircle);

  $(this).addClass('highlighted');

  // Tooltip x, y coordinates
  let tooltipX = parseFloat(thisCircle.attr('cx'));
  let tooltipY = parseFloat(thisCircle.attr('cy'));

  // Breakpoints
  const alignLeft = 0.5;
  const alignRight = -0.5;
  const alignTop = 0.5;

  if (data[`winnerValue_${year}`] < alignRight) {
    tooltipX = tooltipX - 50;
  } else if (data[`winnerValue_${year}`] > alignLeft) {
    tooltipX = tooltipX - tooltipWidth + 25;
  } else {
    tooltipX = tooltipX - (tooltipWidth / 2);
  }

  if (data[`turnout_${year}`] < alignTop) {
    tooltipY = tooltipY - tooltipHeight;
  } else {
    tooltipY = tooltipY + 35 + parseFloat(thisCircle.attr('r'));
  }

  d3.select('.tooltip')
    .html(populateTooltip(data, year))
    .style('left', `${tooltipX}px`)
    .style('top', `${tooltipY}px`)
    .classed('active', true);
}
