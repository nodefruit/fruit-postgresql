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

describe('Successfully selecting data', function () {
  var error     = false
    , result    = null
    , condition = {
        name    : 'khalid'
      , age     : 26
    };

  beforeEach(function (done) {
    adapter.find(tableName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    });
  });

  it('should find a user with the same name and age', function () {
    assert.equal(result.length, 1);
    assert.equal(result[0].name, condition.name);
    assert.equal(result[0].age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting data with limit', function () {
  var error     = false
    , result    = null
    , condition = { age: 30 };

  beforeEach(function (done) {
    adapter.find(tableName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    }, 2);
  });

  it('should find 2 users with the same age', function () {
    assert.equal(result.length, 2);
    assert.equal(result[0].age, condition.age);
    assert.equal(result[1].age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting data with an offset', function () {
  var error     = false
    , result    = null
    , condition = { age: 30 };

  beforeEach(function (done) {
    adapter.find(tableName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    }, null, 1);
  });

  it('should find 2 users with the same age starting from offset 1', function () {
    assert.equal(result.length, 2);
    assert.equal(result[0].age, condition.age);
    assert.equal(result[1].age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting data with limit and offset', function () {
  var error     = false
    , result    = null
    , condition = { age: 30 };

  beforeEach(function (done) {
    adapter.find(tableName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    }, 1, 1);
  });

  it('should find only one user with the same age starting from offset 1', function () {
    assert.equal(result.length, 1);
    assert.equal(result[0].age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting one row', function () {
  var error     = false
    , result    = null
    , condition = { age: 30 };

  beforeEach(function (done) {
    adapter.findOne(tableName, condition, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    });
  });

  it('should find only one user', function () {
    assert.equal(result.age, condition.age);
    assert.equal(error, null);
  });
});

describe('Successfully selecting all data', function () {
  var error     = false
    , result    = null;

  beforeEach(function (done) {
    adapter.findAll(tableName, function (err, rst) {
      error   = err;
      result  = rst;
      done();
    });
  });

  it('should find all 5 inserted users', function () {
    assert.equal(result.length, 5);
    assert.equal(error, null);
  });
});

describe('Unsuccessful find query due to inexisting table', function () {
  var error   = false
    , result  = false
    , table   = 'user_' + Math.random().toString(36).substring(7);

  beforeEach(function (done) {
    adapter.find(table, {}, function (err, rst) {
      error   = !!err;
      result  = !!rst;
      done();
    });
  });

  it('should return an error', function () {
    assert.equal(error, true);
    assert.equal(result, false);
  });
});

describe('Unsuccessful find query due to incorrect condition', function () {
  var error     = false
    , result    = false
    , condition = {
        myname  : 'khalid'
      , myage   : 26
    };

  beforeEach(function (done) {
    adapter.find(tableName, condition, function (err, rst) {
      error   = !!err;
      result  = !!rst;
      done();
    });
  });

  it('should return an error', function () {
    assert.equal(error, true);
    assert.equal(result, false);
  });
});

describe('Unsuccessful findOne query due to inexisting table', function () {
  var error   = false
    , result  = false
    , table   = 'user_' + Math.random().toString(36).substring(7);

  beforeEach(function (done) {
    adapter.findOne(table, {}, function (err, rst) {
      error   = !!err;
      result  = !!rst;
      done();
    });
  });

  it('should return an error', function () {
    assert.equal(error, true);
    assert.equal(result, false);
  });
});

describe('Unsuccessful findOne query due to incorrect condition', function () {
  var error     = false
    , result    = false
    , condition = {
        myname  : 'khalid'
      , myage   : 26
    };

  beforeEach(function (done) {
    adapter.findOne(tableName, condition, function (err, rst) {
      error   = !!err;
      result  = !!rst;
      done();
    });
  });

  it('should return an error', function () {
    assert.equal(error, true);
    assert.equal(result, false);
  });
});

describe('Unsuccessful findAll query due to inexisting table', function () {
  var error   = false
    , result  = false
    , table   = 'user_' + Math.random().toString(36).substring(7);

  beforeEach(function (done) {
    adapter.findAll(table, function (err, rst) {
      error   = !!err;
      result  = !!rst;
      done();
    });
  });

  it('should return an error', function () {
    assert.equal(error, true);
    assert.equal(result, false);
  });
});

describe('successful count query', function () {
  var error     = false
    , result    = null
    , condition = { name : 'khalid' }

  beforeEach(function (done) {
    adapter.count(tableName, condition, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should count users with name khalid', function () {
    assert.equal(error, false);
    assert.equal(result, 1);
  });
});

describe('unsuccessful count query due to inexisting table', function () {
  var error     = false
    , result    = null
    , table     = 'user_' + Math.random().toString(36).substring(7)
    , condition = { name : 'khalid' }

  beforeEach(function (done) {
    adapter.count(table, condition, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should return an error', function () {
    assert.equal(error, true);
    assert.equal(result, null);
  });
});

describe('successful update query', function () {
  var error     = false
    , result    = null
    , data      = { name : 'KHALID' }
    , condition = { name : 'khalid' }

  beforeEach(function (done) {
    adapter.update(tableName, data, condition, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should update first user with name khalid', function () {
    assert.equal(error, false);
    assert.equal(result.results.success, true);
    assert.equal(result.results.count, 1);
    assert.equal(result.results.affectedCount, 1);
  });
});

describe('successful updateAll query', function () {
  var error     = false
    , result    = null
    , data      = { age : 50 }
    , condition = { age : 30 }

  beforeEach(function (done) {
    adapter.updateAll(tableName, data, condition, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should update all users with age 30', function () {
    assert.equal(error, false);
    assert.equal(result.results.success, true);
    assert.equal(result.results.count, 3);
    assert.equal(result.results.affectedCount, 3);
  });
});

describe('unsuccessful update query due to inexisting table', function () {
  var error     = false
    , result    = null
    , table     = 'user_' + Math.random().toString(36).substring(7)
    , data      = { name : 'KHALID' }
    , condition = { name : 'khalid' }

  beforeEach(function (done) {
    adapter.update(table, data, condition, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should return an error', function () {
    assert.equal(error, true);
    assert.equal(result, null);
  });
});

describe('unsuccessful update query due to incorrect data', function () {
  var error     = false
    , result    = null
    , data      = { myname : 'KHALID' }
    , condition = { name : 'khalid' }

  beforeEach(function (done) {
    adapter.update(tableName, data, condition, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should return an error', function () {
    assert.equal(error, true);
    assert.equal(result, null);
  });
});

describe('unsuccessful updateAll query due to inexisting table', function () {
  var error     = false
    , result    = null
    , table     = 'user_' + Math.random().toString(36).substring(7)
    , data      = { name : 'KHALID' }
    , condition = { name : 'khalid' }

  beforeEach(function (done) {
    adapter.updateAll(table, data, condition, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should return an error', function () {
    assert.equal(error, true);
    assert.equal(result, null);
  });
});

describe('unsuccessful updateAll query due to incorrect data', function () {
  var error     = false
    , result    = null
    , data      = { myname : 'KHALID' }
    , condition = { name : 'khalid' }

  beforeEach(function (done) {
    adapter.updateAll(tableName, data, condition, function (err, rst) {
      result  = rst;
      error   = !!err;
      done();
    });
  });

  it('should return an error', function () {
    assert.equal(error, true);
    assert.equal(result, null);
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
