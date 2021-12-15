const { authenticate } = require('@feathersjs/authentication').hooks

const addTimeStamp = require('../../hooks/add-time-stamp');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks

const preprocessUser = require('../../hooks/preprocess-user');

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [addTimeStamp('createdAt'), hashPassword('password'), preprocessUser()],
    update: [hashPassword('password'), authenticate('jwt')],
    patch: [hashPassword('password'), authenticate('jwt')],
    remove: [authenticate('jwt')]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
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
}
