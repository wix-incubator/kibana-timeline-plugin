import './timeline.css'
import './timeline_controller'

import optionsTemplate from './timeline_params.html'
import template from './timeline.html'

import {CATEGORY} from 'ui/vis/vis_category'
import {VisFactoryProvider} from 'ui/vis/vis_factory'
import {VisSchemasProvider} from 'ui/vis/editors/default/schemas'
import {VisTypesRegistryProvider} from 'ui/registry/vis_types'

VisTypesRegistryProvider.register(function timelineProvider(Private) {
  const VisFactory = Private(VisFactoryProvider)
  const Schemas = Private(VisSchemasProvider)

  return VisFactory.createAngularVisualization({
    name: 'timeline',
    title: 'Actions Timeline',
    icon: 'fa-align-center',
    description: 'timeline analysis plugin',
    category: CATEGORY.OTHER,
    visConfig: {
      defaults: {
        mapColors: ''
      },
      template: template,
    },
    hierarchicalData: true,
    responseHandler: 'none',
    editorConfig: {
      optionsTemplate: optionsTemplate,
      schemas: new Schemas([
        {
          group: 'metrics',
          name: 'metric',
          title: 'Total',
          max: 1,
          min: 1,
          aggFilter: ['count', 'sum', 'avg'],
          defaults: [
            {type: 'count', schema: 'metric'}
          ]
        }, {
          group: 'buckets',
          name: 'timeline_date',
          title: 'timeline Date',
          min: 1,
          max: 1,
          aggFilter: ['date_histogram', 'terms']
        }, {
          group: 'buckets',
          name: 'timeline_period',
          title: 'timeline Period',
          min: 1,
          max: 1,
          aggFilter: 'histogram'
        }
      ])
    }
  })
})

