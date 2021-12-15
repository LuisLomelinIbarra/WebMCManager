const users = require('./users/users.service.js')
const mchandler = require('./mchandler/mchandler.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users)
  app.configure(mchandler);
}
