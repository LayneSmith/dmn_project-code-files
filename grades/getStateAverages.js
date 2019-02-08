export default function () {

  const texasScoreTotals = {};
  const texasScoreAverages = {};

  // console.group('STATE AVERAGES');
  // //////////////////////////////////////////////////////////////////////////
  // SET AS NUMBERS
  // //////////////////////////////////////////////////////////////////////////
  window.districtEnrollments.map((d) => {
    d['Total Number of Students'] = +d['Total Number of Students'];
  });

  // //////////////////////////////////////////////////////////////////////////
  // SET EMPTY PAYLOAD
  // //////////////////////////////////////////////////////////////////////////
  const sizeDistrictEnrollments = {}; // Districts sorted by size
  const schoolsWithScores = {};
  const sizeDistrictCounts = {};


  // //////////////////////////////////////////////////////////////////////////
  // PREPARE LOOPING MARKERS
  // //////////////////////////////////////////////////////////////////////////
  const sizes = ['large', 'mediumLarge', 'medium', 'mediumSmall', 'small'];
  const types = ['Elementary', 'Middle School', 'High School'];
  const metrics = ['Overall Score', 'Academic Growth Score', 'Relative Performance Score', 'Student Achievement Score', 'Closing the Gaps Score'];

  const enrollmentScale = {
    large: [50000, 100000000],
    mediumLarge: [25000, 49999],
    medium: [10000, 24999],
    mediumSmall: [5000, 9999],
    small: [0, 4999],
  };

  // Get districts by size
  sizes.forEach((d1) => {
    sizeDistrictEnrollments[d1] = [];
    const distObj = window.districtEnrollments.filter(d => (d['Total Number of Students'] >= enrollmentScale[d1][0]) && (d['Total Number of Students'] <= enrollmentScale[d1][1]));
    distObj.forEach((d2) => {
      sizeDistrictEnrollments[d1].push(d2[['District Number']]);
    });
  });

  // Build TEXASSCORETOTALS AND SCHOOLSWITHSCORES objects
  sizes.forEach((e1) => {
    // 'large'
    texasScoreTotals[e1] = {};
    schoolsWithScores[e1] = {};
    types.forEach((e2) => {
      // 'Elementary'
      texasScoreTotals[e1][e2] = {};
      schoolsWithScores[e1][e2] = {};
      metrics.forEach((e3) => {
        // 'Overall Score'
        schoolsWithScores[e1][e2][e3] = [];
        let total = 0;
        window.allSchoolData.map((e4) => {
          if (sizeDistrictEnrollments[e1].includes(e4['District Number']) && e4['School Type'] === e2) {
            if (Number.isInteger(e4[e3])) {
              schoolsWithScores[e1][e2][e3].push(e4['Campus Number']);
              total += e4[e3];
            }
          }
        });
        texasScoreTotals[e1][e2][e3] = total;
      });
    });
  });

  // Build TEXASSCORETOTALS AND SCHOOLSWITHSCORES objects
  sizes.forEach((f1) => {
    // 'large'
    texasScoreAverages[f1] = {};
    types.forEach((f2) => {
      // 'Elementary'
      texasScoreAverages[f1][f2] = {};
      metrics.forEach((f3) => {
        texasScoreAverages[f1][f2][f3] = Math.round(texasScoreTotals[f1][f2][f3] / schoolsWithScores[f1][f2][f3].length);
      });
    });
  });

  return texasScoreAverages;

}
