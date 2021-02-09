// PROCESSING THE UPLOADED DATA
// processData is the function where we are writting our logic to get the data and show it as the way we want

let dataHeadings = {};

let metricGroups = [];

let wantedColumns = {
  MetricGroup: 3,
  MetricName: 4,
  ControlAverage: 7,
  TreatmentAverage: 10, // as Var Rate
  RelativeObservedDelta: 13, // as Lift and convert it to percentage based
  pValue: 18, // as Conf.
};

const tableHeaderStr = `
  <div class="metric-cell header"><p>MetricName</p></div>
  <div class="metric-cell header"><p>ControlAverage</p></div>
  <div class="metric-cell header"><p>Var Rate</p></div>
  <div class="metric-cell header"><p>Lift</p></div>
  <div class="metric-cell header"><p>Conf.</p></div>
`

const wantedColumnsIndices = Object.values(wantedColumns);

function processData(csv) {
    var allRecords = csv.split(/\r\n|\n/);
    // console.log('allRecords: ', allRecords);
    var dataRecords = [];
    while (allRecords.length) {
        dataRecords.push(allRecords.shift().split(','));
    }

	generateMetricGroups(dataRecords);
}

function generateMetricGroups (dataRecords) {
  // Remove not wanted columns
  let newDataRecords = [];
  for (let i = 0; i < dataRecords.length; i++) {
    let record = [];
    for (let j = 0; j < dataRecords[i].length; j++) {
      if (wantedColumnsIndices.includes(j)) {
        record.push(dataRecords[i][j]);
      }
    }
    
    newDataRecords.push(record);
  }

  // setup indices for dataHeadings (FUTURE USE)
  for (let i = 0; i < newDataRecords[0].length; i++) {
    dataHeadings[newDataRecords[0][i]] = i;
  }

  /*
    0: "MetricGroup"
    1: "MetricName"
    2: "ControlAverage"
    3: "TreatmentAverage"
    4: "RelativeObservedDelta"
    5: "pValue"
  */

  // Generate MetricGroup arrays
  for (let i = 1; i < dataRecords.length; i++) {
    // console.log('MetricGroup: ', newDataRecords[i][0]); // MetricGroup
    // console.log('MetricName: ', newDataRecords[i][1]); // MetricName
    // console.log('ControlAverage: ', newDataRecords[i][2]); // ControlAverage
    // console.log('TreatmentAverage: ', newDataRecords[i][3]); // TreatmentAverage
    // console.log('RelativeObservedDelta: ', newDataRecords[i][4]); // RelativeObservedDelta
    // console.log('pValue: ', newDataRecords[i][5]); // pValue
    // Initialize MetricGroup
    if (!metricGroups[newDataRecords[i][0]]) {
      metricGroups[newDataRecords[i][0]] = {};
    }

    metricGroups[newDataRecords[i][0]][newDataRecords[i][1]]
      = [newDataRecords[i][2], newDataRecords[i][3], newDataRecords[i][4], newDataRecords[i][5]]
  }

  showMetrics(metricGroups);
}
  /*
  metricGroups = {
    MetricGroupName1: {
      MetricName1: ['ControlAverage', 'TreatmentAverage', 'RelativeObservedDelta', 'pValue'],
      MetricName2: [ data ],
      MetricName3: [ data ],
      MetricName4: [ data ]
    },
    MetricGroupName2: {
      MetricName1: [ data ],
      MetricName2: [ data ],
      MetricName3: [ data ],
      MetricName4: [ data ]
    },
  }
  */

function showMetrics(metricGroups) {
  let tableString = '';
  for (let metricGroup in metricGroups) {
    if (metricGroup !== "") {
      tableString += `<div class="row"><div class="group-name column">GroupName: ${metricGroup}</div>`
      // console.log('metricGroup: ', metricGroup); // MetricGroupName
      for(let metricName in metricGroups[metricGroup]) {
        tableString += `
            <div class="metric-cell"><p>${metricName}</p></div>
            <div class="metric-cell"><p>${metricGroups[metricGroup][metricName][0]}</p></div>
            <div class="metric-cell"><p>${metricGroups[metricGroup][metricName][1]}</p></div>
            <div class="metric-cell"><p>${metricGroups[metricGroup][metricName][2]}</p></div>
            <div class="metric-cell"><p>${metricGroups[metricGroup][metricName][3]}</p></div>
        `;
        // console.log('metricName: ', metricName);
        // console.log('controlAerage: ', metricGroups[metricGroup][metricName][0]); // ControlAverage
        // console.log('TreatmentAverage: ', metricGroups[metricGroup][metricName][1]); // TreatmentAverage
        // console.log('RelativeObservedDelta: ', metricGroups[metricGroup][metricName][2]); // RelativeObservedDelta
        // console.log('pValue: ', metricGroups[metricGroup][metricName][3]); // pValue
      }
    }
    
    tableString += '</div><hr />';

  };
  
  // Add results to the page
  document.querySelector('#result').insertAdjacentHTML('beforeend', tableString);
  // Add table header to each row
  document.querySelectorAll('.group-name')
    .forEach(node => {
      return node.insertAdjacentHTML('afterend', tableHeaderStr);
    });
}