export default kibana => {
  return new kibana.Plugin({
    id: 'timeline',
    require: ['elasticsearch'],

    uiExports: {
      visTypes: [
        'plugins/timeline/timeline'
      ]
    },

    config: (Joi) => Joi.object({
      enabled: Joi.boolean().default(true)
    }).default(),
  });
}
