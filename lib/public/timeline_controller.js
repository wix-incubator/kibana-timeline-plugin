import 'ui/visualize';
import {AggResponseTabifyProvider} from 'ui/agg_response/tabify/tabify';
import {uiModules} from 'ui/modules';
import {getFormatTypes, processData, getValueFunction, showTable} from './utils';

const module = uiModules.get('timeline', ['kibana']);
module.controller('timelineController', function ($scope, $element, Private) {
  const tabifyAggResponse = Private(AggResponseTabifyProvider);

  $scope.$watchMulti([
    'esResponse',
    'vis.params.requestId'
  ], ([resp]) => {
    if (!resp) {
      return;
    }

    const esData = tabifyAggResponse($scope.vis, resp);
    const formatTime = getFormatTypes($scope.vis);
    const data = processData(esData, $scope.vis);
    const valueFn = getValueFunction($scope.vis.params);

    const $div = $element.empty();
    const $closest = $div.closest('.visualize-chart');
    const margin = {top: 40, right: 80, bottom: 40, left: 50};
    const width = $closest.width() - margin.left - margin.right;
    const height = $closest.height() - margin.top - margin.bottom;
    const allWidth = width + margin.right + margin.left;
    const allHeight = height + margin.top + margin.bottom;
    const measures = {width, height, margin, allWidth, allHeight};

    const requestId = $scope.vis.params.requestId

    console.log({requestId})
    console.log({element:$element[0], measures, valueFn, formatTime, data})
    showTable($scope.vis, $scope.vis.params.mapColors, $element[0], measures, data, valueFn, formatTime);

    // if ($scope.vis.params.table) {
    // } else {
    //   showGraph($scope.vis.params.requestId, $element[0], measures, data, valueFn, formatTime);
    // }
  });
});
