// Initializes the `mchandler` service on path `/mchandler`
const { Mchandler } = require('./mchandler.class');
const createModel = require('../../models/mchandler.model');
const hooks = require('./mchandler.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/mchandler', new Mchandler(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('mchandler');

  service.hooks(hooks);
};
