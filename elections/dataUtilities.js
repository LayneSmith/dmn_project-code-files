import $ from 'jquery';
import * as d3 from 'd3';
import { returnWinner, resetCounties } from './utilities';

// ////////////////////////////////////////////////////////////////////////////
// CALCULATE DATA OPTIONS FOR BUTTONS AND CUSTOM DISPLAYS
// ////////////////////////////////////////////////////////////////////////////
function displayArray(data) {
  resetCounties();
  $('svg .county').fadeOut();
  data.forEach((d) => {
    $(`svg .county.c${d.fips}`).fadeIn();
  });
}

// LARGEST POPULATION COUNTIES
export function showTop10CountiesByPopulation(data) {
  data.sort((a, b) => b.total_voters_2018 - a.total_voters_2018);
  const top10 = data.slice(0, 10);
  displayArray(top10);
}

// STRONGEST DEMOCRAT COUNTIES
export function showStrongestDemocratCounties(data) {
  const countyAverages = [];
  data.forEach((d) => {
    const thisFips = d.fips;
    const thisAvg = (d.winnerValue_2008 + d.winnerValue_2010 + d.winnerValue_2012 + d.winnerValue_2014 + d.winnerValue_2016 + d.winnerValue_2018)/6
    countyAverages.push({fips: thisFips, average: thisAvg});
  })
  countyAverages.sort((a, b) => a.average - b.average);
  const top10 = countyAverages.slice(0, 10);
  displayArray(top10);
}

// STRONGEST REPUBLICAN COUNTIES
export function showStrongestRepublicanCounties(data) {
  const countyAverages = [];
  data.forEach((d) => {
    const thisFips = d.fips;
    const thisAvg = (d.winnerValue_2008 + d.winnerValue_2010 + d.winnerValue_2012 + d.winnerValue_2014 + d.winnerValue_2016 + d.winnerValue_2018)/6
    countyAverages.push({fips: thisFips, average: thisAvg});
  })
  countyAverages.sort((a, b) => b.average - a.average);
  const top10 = countyAverages.slice(0, 10);
  displayArray(top10);
}

// STRONGEST REPUBLICAN COUNTIES
export function showStrongestDemocratMovement(data) {
  const countyAverages = [];
  data.forEach((d) => {
    const thisCounty = d.county;
    const thisFips = d.fips;
    const thisAvg = ((d.winnerValue_2008 - d.winnerValue_2010) + (d.winnerValue_2010 - d.winnerValue_2012) + (d.winnerValue_2012 - d.winnerValue_2014) + (d.winnerValue_2014 - d.winnerValue_2016) + (d.winnerValue_2016 - d.winnerValue_2018)) / 5
    countyAverages.push({ county:thisCounty, fips: thisFips, average: thisAvg });
  });
  countyAverages.sort((a, b) => b.average - a.average);
  const top10 = countyAverages.slice(0, 10);
  console.table(top10);
  displayArray(top10);
}

// MAX SWINGS
export function maxSwings(data) {
  const countyExtents = [];
  data.forEach((d) => {
    const extent = d3.extent([d.winnerValue_2008, d.winnerValue_2010, d.winnerValue_2012, d.winnerValue_2014, d.winnerValue_2016, d.winnerValue_2018]);
    const thisCounty = d.county;
    const thisFips = d.fips;
    const thisExtent = extent[1] - extent[0];
    countyExtents.push({ county:thisCounty, fips: thisFips, extent: thisExtent });
  });
  countyExtents.sort((a, b) => b.extent - a.extent);
  const top10 = countyExtents.slice(0, 10);
  console.table(top10);
  displayArray(top10);
}
// MIN SWINGS
export function minSwings(data) {
  const countyExtents = [];
  data.forEach((d) => {
    const extent = d3.extent([d.winnerValue_2008, d.winnerValue_2010, d.winnerValue_2012, d.winnerValue_2014, d.winnerValue_2016, d.winnerValue_2018]);
    const thisCounty = d.county;
    const thisFips = d.fips;
    const thisExtent = extent[1] - extent[0];
    countyExtents.push({ county:thisCounty, fips: thisFips, extent: thisExtent });
  });
  countyExtents.sort((a, b) => a.extent - b.extent);
  const top10 = countyExtents.slice(0, 10);
  console.table(top10);
  displayArray(top10);
}

// MOVING LEFT SINCE 2008
export function movingLeft2008(data) {
  const counties = [];
  data.forEach((d) => {
    if ( d.winnerValue_2018 < d.winnerValue_2008) {
      const thisCounty = d.county;
      const thisFips = d.fips;
      const thisExtent = Math.abs(d.winnerValue_2008 - d.winnerValue_2018);
      counties.push({ county:thisCounty, fips: thisFips, extent: thisExtent });
    }
  });
  counties.sort((a, b) => b.extent - a.extent);
  displayArray(counties);
}

// MOVING LEFT SINCE 2016
export function movingLeft2016(data) {
  const counties = [];
  data.forEach((d) => {
    if ( d.winnerValue_2018 < d.winnerValue_2016) {
      const thisCounty = d.county;
      const thisFips = d.fips;
      const thisExtent = Math.abs(d.winnerValue_2016 - d.winnerValue_2018);
      counties.push({ county:thisCounty, fips: thisFips, extent: thisExtent });
    }
  });
  counties.sort((a, b) => b.extent - a.extent);
  displayArray(counties);
}

export function refineData(data) {
  data.forEach((d) => {
    d.fips = +d.fips;
    d.dem_2008 = +d.dem_2008;
    d.dem_2010 = +d.dem_2010;
    d.dem_2012 = +d.dem_2012;
    d.dem_2014 = +d.dem_2014;
    d.dem_2016 = +d.dem_2016;
    d.dem_2018 = +d.dem_2018;
    d.dem_pct_2008 = +d.dem_pct_2008;
    d.dem_pct_2010 = +d.dem_pct_2010;
    d.dem_pct_2012 = +d.dem_pct_2012;
    d.dem_pct_2014 = +d.dem_pct_2014;
    d.dem_pct_2016 = +d.dem_pct_2016;
    d.dem_pct_2018 = +d.dem_pct_2018;
    d.lib_2008 = +d.lib_2008;
    d.lib_2010 = +d.lib_2010;
    d.lib_2012 = +d.lib_2012;
    d.lib_2014 = +d.lib_2014;
    d.lib_2016 = +d.lib_2016;
    d.lib_2018 = +d.lib_2018;
    d.lib_pct_2008 = +d.lib_pct_2008;
    d.lib_pct_2010 = +d.lib_pct_2010;
    d.lib_pct_2012 = +d.lib_pct_2012;
    d.lib_pct_2014 = +d.lib_pct_2014;
    d.lib_pct_2016 = +d.lib_pct_2016;
    d.lib_pct_2018 = +d.lib_pct_2018;
    d.pop_2012 = +d.pop_2012;
    d.pop_2017 = +d.pop_2017;
    d.rep_2008 = +d.rep_2008;
    d.rep_2010 = +d.rep_2010;
    d.rep_2012 = +d.rep_2012;
    d.rep_2014 = +d.rep_2014;
    d.rep_2016 = +d.rep_2016;
    d.rep_2018 = +d.rep_2018;
    d.rep_pct_2008 = +d.rep_pct_2008;
    d.rep_pct_2010 = +d.rep_pct_2010;
    d.rep_pct_2012 = +d.rep_pct_2012;
    d.rep_pct_2014 = +d.rep_pct_2014;
    d.rep_pct_2016 = +d.rep_pct_2016;
    d.rep_pct_2018 = +d.rep_pct_2018;
    d.total_voters_2008 = +d.total_voters_2008;
    d.total_voters_2010 = +d.total_voters_2010;
    d.total_voters_2012 = +d.total_voters_2012;
    d.total_voters_2014 = +d.total_voters_2014;
    d.total_voters_2016 = +d.total_voters_2016;
    d.total_voters_2018 = +d.total_voters_2018;
    d.total_votes_2008 = +d.total_votes_2008;
    d.total_votes_2010 = +d.total_votes_2010;
    d.total_votes_2012 = +d.total_votes_2012;
    d.total_votes_2014 = +d.total_votes_2014;
    d.total_votes_2016 = +d.total_votes_2016;
    d.total_votes_2018 = +d.total_votes_2018;
    d.turnout_2008 = +d.turnout_2008;
    d.turnout_2010 = +d.turnout_2010;
    d.turnout_2012 = +d.turnout_2012;
    d.turnout_2014 = +d.turnout_2014;
    d.turnout_2016 = +d.turnout_2016;
    d.turnout_2018 = +d.turnout_2018;
  });

  let flipDemCount2008 = 0;
  let flipDemCount2014 = 0;
  let flipRepCount2008 = 0;
  let flipRepCount2014 = 0;

  data.forEach((d) => {
    d.winnerValue_2008 = returnWinner(d, '2008');
    d.winnerValue_2010 = returnWinner(d, '2010');
    d.winnerValue_2012 = returnWinner(d, '2012');
    d.winnerValue_2014 = returnWinner(d, '2014');
    d.winnerValue_2016 = returnWinner(d, '2016');
    d.winnerValue_2018 = returnWinner(d, '2018');

    const scores = [d.winnerValue_2008, d.winnerValue_2010, d.winnerValue_2012, d.winnerValue_2014, d.winnerValue_2016, d.winnerValue_2018];

    if (Math.min(...scores) > 0) {
      d.republican = true;
      d.democrat = false;
      d.flipper = false;
    }
    if (Math.min(...scores) < 0) {
      d.republican = false;
      d.democrat = true;
      d.flipper = false;
    }
    if (Math.min(...scores) < 0 && Math.max(...scores) > 0) {
      d.republican = false;
      d.democrat = false;
      d.flipper = true;
    }
    if (d.winnerValue_2008 > 0 && d.winnerValue_2018 <= 0) {
      flipDemCount2008++;
      d.flipToDem2008 = true;
    }
    if (d.winnerValue_2014 > 0 && d.winnerValue_2018 <= 0) {
      flipDemCount2014++;
      d.flipToDem2014 = true;
    }
    if (d.winnerValue_2008 <= 0 && d.winnerValue_2018 > 0) {
      flipRepCount2008++;
      d.flipToRep2008 = true;
    }
    if (d.winnerValue_2014 <= 0 && d.winnerValue_2018 > 0) {
      flipRepCount2014++;
      d.flipToRep2014 = true;
    }

    if (d.winnerValue_2014 > d.winnerValue_2018) {
      d.movingLeft = true;
    } else {
      d.movingRight = true;
    }
  });


  data.sort((a, b) => b.total_voters_2018 - a.total_voters_2018);

  return data;
}
