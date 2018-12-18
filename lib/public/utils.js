// let {d3WithGantt: d3} = require('./d3-with-gantt')

const red = '#ff4e61';
const yellow = '#ffef7d';
const green = '#32c77c';
const colors = [red, yellow, green];
const formatTypes = {
  undefined: (d) => d,
  custom: d3.time.format('%Y/%m/%d %H:%M:%S'),
  auto: d3.time.format('%Y/%m/%d %H:%M:%S'),
  ms: d3.time.format('%Y/%m/%d %H:%M:%S,%L'),
  s: d3.time.format('%Y/%m/%d %H:%M:%S'),
  m: d3.time.format('%Y/%m/%d %H:%M'),
  h: d3.time.format('%Y/%m/%d %H:%M'),
  d: d3.time.format('%Y/%m/%d'),
  w: d3.time.format('%Y/%m/%d'),
  M: d3.time.format('%Y/%m'),
  y: d3.time.format('%Y')
};

export const round = (v) => Math.round(v * 100) / 100;
export const cumulativeFn = (d) => d.cumulativeValue;
export const absoluteFn = (d) => d.value;
export const getFormatTypes = ($vis) => formatTypes[getDateHistogram($vis)];

// export function showGantt($vis, mapColors, element, measures, data, valueFn, formatTime) {
//   const tasks = [
//     {
//       "startDate": new Date("Sun Dec 09 01:36:45 EST 2012"),
//       "endDate": new Date("Sun Dec 09 02:36:45 EST 2012"),
//       "taskName": "E Job",
//       "status": "FAILED"
//     },
//
//     {
//       "startDate": new Date("Sun Dec 09 04:56:32 EST 2012"),
//       "endDate": new Date("Sun Dec 09 06:35:47 EST 2012"),
//       "taskName": "A Job",
//       "status": "RUNNING"
//     }];
//   const taskStatus = {
//     "SUCCEEDED": "bar",
//     "FAILED": "bar-failed",
//     "RUNNING": "bar-running",
//     "KILLED": "bar-killed"
//   };
//   const taskNames = [ "D Job", "P Job", "E Job", "A Job", "N Job" ];
//   const gantt = d3.gantt().taskTypes(taskNames).taskStatus(taskStatus);
//   gantt(tasks);
//
//   // let minMaxesForColumn = [];
//   // const periodMeans = d3.nest().key((d) => d.period)
//   //   .entries(data).map((d) => {
//   //     const minMax = d3.extent(d.values, valueFn);
//   //     const mean = round(d3.mean(d.values, valueFn));
//   //     const minMaxObj = {
//   //       min: minMax[0],
//   //       max: minMax[1],
//   //       mean: mean
//   //     };
//   //     minMaxesForColumn.push(minMaxObj);
//   //     return mean;
//   //   });
//
//   // const customColumn = getDateHistogram($vis) ? 'Date' : 'Term';
//   // const fixedColumns = ['Total', customColumn];
//   // const columns = d3.map(data, (d) => d.period).keys().map(x => parseInt(x, 10));
//   // const allColumns = fixedColumns.concat(columns);
//
//   //todo:(san)
//   d3.select(element).append('gantt')
//     .attr('width', measures.width)
//     .attr('class', 'timeline_table');
//
//
//   //
//   // const thead = table.append('thead');
//   // const tbody = table.append('tbody');
//   // const tfoot = table.append('tfoot');
//   //
//   // thead.append('tr')
//   //   .selectAll('th')
//   //   .data(allColumns)
//   //   .enter()
//   //   .append('th')
//   //   .text((column) => column);
//   //
//   // const groupedData = d3.nest().key((d) => formatTime(d.date)).entries(data);
//   // const rows = tbody.selectAll('tr')
//   //   .data(groupedData)
//   //   .enter()
//   //   .append('tr');
//   //
//   // const colorScale = getColorScale(mapColors, data, valueFn);
//   //
//   // rows.selectAll('td')
//   //   .data((row) => {
//   //     const date = row.key;
//   //     let total = 0;
//   //     const vals = columns.map((period) => {
//   //       const d = row.values.find((d) => period === d.period);
//   //       if (d) {
//   //         total = round(d.total);
//   //         return valueFn(d);
//   //       }
//   //     });
//   //
//   //     return [total, date].concat(vals);
//   //   })
//   //   .enter()
//   //   .append('td')
//   //   .style('background-color', (d, i) => {
//   //     if (i >= 2) { // skip first and second columns
//   //       return colorScale(d, minMaxesForColumn[i - 2]);
//   //     }
//   //   })
//   //   .text((d) => d);
//   //
//   // const meanOfMeans = round(d3.mean(periodMeans, (meanObj) => meanObj));
//   // const meanOfMeansTittle = `Mean (${meanOfMeans})`;
//   // const allMeans = ['-', meanOfMeansTittle].concat(periodMeans);
//   //
//   // tfoot.append('tr')
//   //   .selectAll('td')
//   //   .data(allMeans)
//   //   .enter()
//   //   .append('td')
//   //   .text((d) => d);
// }


export function showTable($vis, mapColors, element, measures, data, valueFn, formatTime) {
  let minMaxesForColumn = [];
  const periodMeans = d3.nest().key((d) => d.period)
  .entries(data).map((d) => {
    const minMax = d3.extent(d.values, valueFn);
    const mean = round(d3.mean(d.values, valueFn));
    const minMaxObj = {
      min: minMax[0],
      max: minMax[1],
      mean: mean
    };
    minMaxesForColumn.push(minMaxObj);
    return mean;
  });

  const customColumn = getDateHistogram($vis) ? 'Date' : 'Term';
  const fixedColumns = ['Total', customColumn];
  const columns = d3.map(data, (d) => d.period).keys().map(x => parseInt(x, 10));
  const allColumns = fixedColumns.concat(columns);

  const table = d3.select(element).append('table')
  .attr('width', measures.width)
  .attr('class', 'timeline_table');

  const thead = table.append('thead');
  const tbody = table.append('tbody');
  const tfoot = table.append('tfoot');

  thead.append('tr')
  .selectAll('th')
  .data(allColumns)
  .enter()
  .append('th')
  .text((column) => column);

  const groupedData = d3.nest().key((d) => formatTime(d.date)).entries(data);
  const rows = tbody.selectAll('tr')
  .data(groupedData)
  .enter()
  .append('tr');

  const colorScale = getColorScale(mapColors, data, valueFn);

  rows.selectAll('td')
  .data((row) => {
    const date = row.key;
    let total = 0;
    const vals = columns.map((period) => {
      const d = row.values.find((d) => period === d.period);
      if (d) {
        total = round(d.total);
        return valueFn(d);
      }
    });

    return [total, date].concat(vals);
  })
  .enter()
  .append('td')
  .style('background-color', (d, i) => {
    if (i >= 2) { // skip first and second columns
      return colorScale(d, minMaxesForColumn[i - 2]);
    }
  })
  .text((d) => d);

  const meanOfMeans = round(d3.mean(periodMeans, (meanObj) => meanObj));
  const meanOfMeansTittle = `Mean (${meanOfMeans})`;
  const allMeans = ['-', meanOfMeansTittle].concat(periodMeans);

  tfoot.append('tr')
  .selectAll('td')
  .data(allMeans)
  .enter()
  .append('td')
  .text((d) => d);
}

export function getValueFunction({cumulative, requestId, inverse}) {
  const valueFn = cumulative ? cumulativeFn : absoluteFn;
  const percentFn = (d) => round((valueFn(d) / d.total) * 100);
  const inverseFn = (d) => round(100 - (valueFn(d) / d.total) * 100);

  if (requestId) {
    if (inverse) {
      return inverseFn;
    } else {
      return percentFn;
    }
  }

  return valueFn;
}

export function getDateHistogram($vis) {
  const schema = $vis.aggs.find((agg) => agg.schema.name === 'timeline_date');
  if (schema && schema.type.name === 'date_histogram') {
    return schema.params.interval.val;
  }
}

export function getHeatMapColor(data, valueFn) {
  const domain = d3.extent(data, valueFn);
  domain.splice(1, 0, d3.mean(domain));
  return d3.scale.linear().domain(domain).range(colors);
}

export function getMeanColor(d, column) {
  return d3.scale.linear().domain([column.min, column.mean, column.max]).range(colors)(d);
}

export function getAboveAverageColor(d, column) {
  if (d > column.mean) {
    return green;
  } else if (d === column.mean) {
    return yellow;
  } else if (d < column.mean) {
    return red;
  }
}

export function getColorScale(mapColors, data, valueFn) {
  if (mapColors === 'heatmap') {
    return getHeatMapColor(data, valueFn);
  } else if (mapColors === 'mean') {
    return getMeanColor;
  } else if (mapColors === 'aboveAverage') {
    return getAboveAverageColor;
  } else {
    return (d) => {
    };
  }
}

export function processData(esData, $vis) {
  console.log({esData})
  const data = esData.tables[0].rows.map((row) => {
    const dateHistogram = getDateHistogram($vis);
    return {
      date: dateHistogram ? new Date(row[0]) : row[0],
      total: row[1],
      period: row[2],
      value: row[3]
    };
  });

  let cumulativeData = {};
  return data.map((d) => {
    const lastValue = cumulativeData[d.date] || 0;
    d.cumulativeValue = lastValue + d.value;
    cumulativeData[d.date] = d.cumulativeValue;
    return d
  });
}
