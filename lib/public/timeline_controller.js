import 'ui/visualize'
import {AggResponseTabifyProvider} from 'ui/agg_response/tabify/tabify'
import {uiModules} from 'ui/modules'
import {showGantt} from './utils'

const module = uiModules.get('timeline', ['kibana'])
module.controller('timelineController', function ($scope, $element, Private, $http, es) {
  const tabifyAggResponse = Private(AggResponseTabifyProvider)

  $scope.$watchMulti([
    'esResponse',
    'vis.params.requestId'
  ], ([resp]) => {
    if (!resp) {
      return
    }

    const esData = tabifyAggResponse($scope.vis, resp)

    const $div = $element.empty()
    const $closest = $div.closest('.visualize-chart')
    const margin = {top: 40, right: 150, bottom: 40, left: 200}
    const width = $closest.width() - margin.left - margin.right
    const height = $closest.height() - margin.top - margin.bottom
    const allWidth = width + margin.right + margin.left
    const allHeight = height + margin.top + margin.bottom
    const measures = {width, height, margin, allWidth, allHeight}

    console.log({measures, esData})
    gatherData($http, $scope.vis, es).then(data => {
      console.log({data})
      showGantt($scope.vis, $element[0], measures, data)
    }).catch(e => {
      console.error("gather data failed,", e)
    })
  })
})


async function gatherData($http, vis, es) {
  const timelineDataMutator = function (d) {
    const endDate = new Date(d['@timestamp'])
    const startDate = new Date(endDate.getTime() - parseFloat(d['duration_sec']) * 1000)
    const service = `${d['service']}`
    const action = `${d['action']}`
    const dc = `${d['location']}`
    const taskName = `${service} [${action}]`
    const duration_sec = `${d['duration_sec']}`
    return {startDate, endDate, taskName, service, action, dc, duration_sec}
  }

  const requestId = vis.params.requestId
  const index = "logstash-*"
  const query = {
    index,
    size: 500,
    body: {query: {match: {request_id: requestId}}}
  }
  console.log({query})

  return es.search(query).then(function (body) {
    console.log({body})
    const hits = body.hits.hits
    const filteredData = hits.map((h) => h._source).filter((h) => h.position == "end")
    const processed = filteredData.map(timelineDataMutator)
    const minStartDate = processed.reduce(function (t1, t2) {
      return (t1.startDate < t2.startDate ? t1 : t2)
    }).startDate
    return processed.map(x => {
      x.startDate -= minStartDate
      x.endDate -= minStartDate
      return x
    })
  }, function (error) {
    throw error
  })
}