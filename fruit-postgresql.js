/* بسم الله الرحمن الرحيم */

module.exports = (function () {
  
  var pg      = require('pg')
    , config  = {};

  // @todo : needs to be called only one time
  function confStringify () {
    return 'postrgre://' 
      + config.user + ':'
      + config.password + '@'
      + config.host + '/'
      + config.database;
  }
  
  function exec (query, callBack) {
    pg.connect(confStringify(), function(err, client, done) {
      if(err) return callBack(err);
      client.query(query, function (err, results) {
        client.end(); 
        done();
        callBack(err, results);
      })
    });
  }
  
  function DataManager () {
    
    this.type = 'postgresql';
    
    this.connect = function (conf, callBack) {
      config = conf;
      exec('SELECT 1 + 1 AS solution', function (err) {
        callBack(err);
      })
      return this;
    }
    
    this.config = function (conf) {
      config = conf;
      return this;
    }
    
  }
  
  return new DataManager;
}());