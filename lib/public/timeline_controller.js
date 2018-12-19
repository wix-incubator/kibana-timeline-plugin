import 'ui/visualize';
import {AggResponseTabifyProvider} from 'ui/agg_response/tabify/tabify';
import {uiModules} from 'ui/modules';
import {showGantt} from './utils';

const module = uiModules.get('timeline', ['kibana']);
module.controller('timelineController', function ($scope, $element, Private, $http) {
  const tabifyAggResponse = Private(AggResponseTabifyProvider);

  $scope.$watchMulti([
    'esResponse',
    'vis.params.requestId'
  ], ([resp]) => {
    if (!resp) {
      return;
    }

    const esData = tabifyAggResponse($scope.vis, resp);

    const $div = $element.empty();
    const $closest = $div.closest('.visualize-chart');
    const margin = {top: 40, right: 80, bottom: 40, left: 150};
    const width = $closest.width() - margin.left - margin.right;
    const height = $closest.height() - margin.top - margin.bottom;
    const allWidth = width + margin.right + margin.left;
    const allHeight = height + margin.top + margin.bottom;
    const measures = {width, height, margin, allWidth, allHeight};

    const requestId = $scope.vis.params.requestId

    console.log({requestId})
    console.log({measures, esData})
    gatherData($http).then(data => {
      showGantt($scope.vis, $element[0], measures, data);
    }).catch(e => {
      console.error("gather data failed,", e)
    });

  });
});


async function gatherData($http) {
  const timelineDataMutator = function (d) {
    const endDate = new Date(d['@timestamp']);
    const startDate = new Date(d['@timestamp']);
    startDate.setSeconds(startDate.getSeconds() - parseInt(d['duration_sec']));
    const service = `${d['service']}`;
    const action = `${d['action']}`;
    const dc = `${d['location']}`;
    const duration_sec = `${d['duration_sec']}`;
    const taskName = `${service} [${action}]`;
    return {startDate, endDate, taskName, service, action, dc, duration_sec};
  };

  const dataPost = '{"index":["wixcode_dummy*"],"ignore_unavailable":true,"preference":1545213547483}\n{"size":500,"_source":{"excludes":[]},"aggs":{"1":{"max":{"field":"level_value"}}},"stored_fields":["*"],"script_fields":{},"docvalue_fields":["@timestamp","reported_timestamp"],"query":{"bool":{"must":[{"match_all":{}},{"range":{"@timestamp":{"gte":1544608749961,"lte":1545213549961,"format":"epoch_millis"}}}],"filter":[],"should":[],"must_not":[]}}}\n';

  return $http.post('/elasticsearch/_msearch', dataPost).then((d) => {

    const hits = d.data.responses[0].hits.hits;
    const filteredData = hits.map((h) => h._source).filter((h) => h.position == "end");

    const processed = filteredData.map(timelineDataMutator);
    console.log(processed);
    return processed
  });
}