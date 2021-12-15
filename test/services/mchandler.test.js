const assert = require('assert');
const app = require('../../src/app');

describe('\'mchandler\' service', () => {
  it('registered the service', () => {
    const service = app.service('mchandler');

    assert.ok(service, 'Registered the service');
  });
});
