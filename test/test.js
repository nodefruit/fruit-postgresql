var pg        = require('pg')
  , assert    = require('assert')
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
  var success = false
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
        pgdone();
        done();
      });
    });
  });

  it('should create the table successfully', function () {
    assert.equal(success, true);
  });
});

describe('Successfully inserting a row', function () {
  var results = {}
    , error   = null
    , data    = {
        name  : 'khalid'
      , age   : 26
    }

  beforeEach(function (done) {
    adapter.insert(tableName, data, function (err, rst) {
      error   = err;
      results = rst;
      done();
    });
  });

  it('it should insert successfully', function () {
    assert.equal(error, null);
    assert.equal(results.result.success, true);
    assert.equal(results.result.affectedCount, 1);
    assert.equal(results.result.count, 1);
    assert.equal(results.insertedId.length, 1);
  });
});

describe('Successfully inserting many rows', function () {
  var results = {}
    , error   = null
    , data    = [
      { name  : 'Ahmed',    age   : 40 },
      { name  : 'Abdullah', age   : 30 },
      { name  : 'Omar',     age   : 30 },
      { name  : 'Othmane' , age   : 30 }
    ];

  beforeEach(function (done) {
    adapter.insert(tableName, data, function (err, rst) {
      error   = err;
      results = rst;
      done();
    });
  });

  it('it should insert successfully', function () {
    assert.equal(error, null);
    assert.equal(results.result.success, true);
    assert.equal(results.result.affectedCount, 4);
    assert.equal(results.result.count, 4);
    assert.equal(results.insertedId.length, 4);
    assert.equal(results.insertedId.toString(), '2,3,4,5');
  });
});

describe('Unsuccessful insertion due to inexisting table', function () {
  var error   = false
    , result  = null
    , table   = 'user_' + Math.random().toString(36).substring(7)
    , data    = {
        name  : 'khalid'
      , age   : 26
    };

  beforeEach(function (done) {
    adapter.insert(table, data, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should not insert', function () {
    assert.equal(result, null);
    assert.equal(error, true);
  });
});

describe('Unsuccessful insertion due to incorrect data', function () {
  var error     = false
    , result    = null
    , data      = {
        myname  : 'khalid'
      , myage   : 26
    };

  beforeEach(function (done) {
    adapter.insert(tableName, data, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should not insert', function () {
    assert.equal(result, null);
    assert.equal(error, true);
  });
});

describe('Droping the test table', function () {
  var success = false
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
        pgdone();
        done();
      });
    });
  });

  it('should drop the table successfully', function () {
    assert.equal(success, true);
  });
});
