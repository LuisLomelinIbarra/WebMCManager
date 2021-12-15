const { authenticate } = require('@feathersjs/authentication').hooks;

const addUserName = require('../../hooks/add-user-name');

const populateUser = require('../../hooks/populate-user');

const isUserAllowed = require('../../hooks/is-user-allowed');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [addUserName(), isUserAllowed()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [populateUser()],
    get: [populateUser()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
