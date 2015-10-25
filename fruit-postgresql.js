/* بسم الله الرحمن الرحيم */

module.exports = (function () {
  
  var pg      = require('pg')
    , sql     = require('sql-query')
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
    
    function cleanQuery (query, tableName) {
      return query.replace('`' + tableName + '`', 'public."' + tableName + '"').split('`').join('')
    }
    
    function generateInsertQuery (tableName, data) {
      var sqlQuery  = sql.Query()
        , sqlInsert = sqlQuery.insert()
        , query     = '';
      
      if(Array.isArray(data)) {
        var values = data.slice(0);
        query  = values.reduce(function (query, record) {
          return query + ' , ' + sqlInsert.into(tableName).set(record).build().split('VALUES').pop();
        }, sqlInsert.into(tableName).set(values.shift()).build());
      } else {
        query = sqlInsert.into(tableName).set(data).build();
      }
      return cleanQuery(query, tableName) + ' RETURNING id; ';
    }
    
    this.insert = function (tableName, data, callBack) {
      var query = generateInsertQuery(tableName, data);
      exec(query, function (err, results) {
        callBack(err, err ? undefined : {
            result : {
                success       : true
              , affectedCount : results.rows.length
              , count         : results.rows.length
            }
          , insertedId : results.rows.map(function (item) { return item.id })
        })
      });
    }
    
    this.find = function (tableName, condition, callBack) {
      var sqlQuery  = sql.Query()
        , sqlSelect = sqlQuery.select()
        ,  query    = cleanQuery(sqlSelect.from(tableName).select().where(condition).build(), tableName);
      
      exec(query, function (err, results) {
        callBack(err, results.rows)
      });
    }
    
    this.findAll = function (tableName, callBack) {
      this.find(tableName, {}, callBack);
    }
    
    this.findOne = function (tableName, condition, callBack) {
      var sqlQuery  = sql.Query()
        , sqlSelect = sqlQuery.select()
        ,  query    = cleanQuery(sqlSelect.from(tableName).select().where(condition).limit(1).build(), tableName);
      
      exec(query, function (err, results) {
        callBack(err, results.rows.shift())
      });
    }
    
    function generateUpdateQuery (one, tableName, data, condition) {
      var sqlQuery    = sql.Query()
        , sqlUpdate   = sqlQuery.update()
        , sqlSelect   = sqlQuery.select()
        , pseudoTable = ''
        , set         = sqlUpdate.into(tableName).set(data).build().split(' SET ').pop().split('`').join('')
      if(one) {
        pseudoTable = ' (' + cleanQuery(sqlSelect.from(tableName).select().where(condition).limit(1).build(), tableName) + ') pseudoTable '
      } else {
        pseudoTable = ' (' + cleanQuery(sqlSelect.from(tableName).select().where(condition).build(), tableName) + ') pseudoTable '
      }
      
      return 'UPDATE public."' + tableName + '" T SET ' + set + ' FROM ' + pseudoTable + ' WHERE T.id = pseudoTable.id; '
    }
    
    function update (one, tableName, data, condition, callBack) {
      var query = generateUpdateQuery(one, tableName, data, condition);
      exec(query, function (err, results) {
        callBack(err, err ? undefined : {
          results : {
              success       : true
            , count         : results.rowCount
            , affectedCount : results.rowCount
          }
        })
      });
    }
    
    this.update = function (tableName, data, condition, callBack) {
      update (true, tableName, data, condition, callBack);
    }
    
    this.updateAll = function (tableName, data, condition, callBack) {
      update (false, tableName, data, condition, callBack);
    }
    
  }
  
  return new DataManager;
}());