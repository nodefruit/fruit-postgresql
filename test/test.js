var assert    = require('assert')
  , adapter   = require('..')
  , config    = require('./testEnv')
  , tableName = 'table_' + Math.random().toString(36).substring(7); // in case the database has some tables

describe('Connexion to the database', function () {
  var success = false;
  
  beforeEach(function (done) {
    adapter.connect(config, function (err) {
      success = !err;
      done();
    });
  });
  
  it('should get connected', function () {
    assert.equal(success, true);
  });
})