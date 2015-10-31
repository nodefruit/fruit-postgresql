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
});

describe('Creating a table for test', function () {
  var pg      = require('pg')
    , success = false
    , query   = 'CREATE table IF NOT EXISTS ' + tableName
      + ' (id serial NOT NULL, name varchar(50), age integer, PRIMARY KEY (id) );'

  beforeEach(function (done) {
    var confString = 'postrgre://'
      + config.user + ':'
      + config.password + '@'
      + config.host + '/'
      + config.database;
    
    pg.connect(confString, function(err, client, pgdone) {
      if(err) return done();
      client.query(query, function (err, results) {
        success = !err;
        client.end(); 
        pgdone();
        done();
      });
    });
  });

  it('should create the table successfully', function () {
    assert.equal(success, true);
  });
});



describe('Creating a table for test', function () {
  var pg      = require('pg')
    , success = false
    , query   = 'DROP TABLE ' + tableName;

  beforeEach(function (done) {
    var confString = 'postrgre://'
      + config.user + ':'
      + config.password + '@'
      + config.host + '/'
      + config.database;
    
    pg.connect(confString, function(err, client, pgdone) {
      if(err) return done();
      client.query(query, function (err, results) {
        success = !err;
        client.end(); 
        pgdone();
        done();
      });
    });
  });

  it('should drop the table successfully', function () {
    assert.equal(success, true);
  });
});
