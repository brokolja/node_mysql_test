var express = require('express');
var mysql = require('mysql');

var app = express();

var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE
});

// Behind nginx proxy use: ?nocache=true for testing...

app.get('/', function (req, res) {
  res.set('Content-Type', 'text/html');
  pool.getConnection(function(err, connection) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      res.send(new Buffer('<html><head><title>Node Mysql Test</title></head><body><p>' + JSON.stringify(err.stack) +'</p></body></html>'));
    } else {
      console.log('connected as id ' + connection.threadId);
      res.send(new Buffer('<html><head><title>Node Mysql Test</title></head><body><p>connected as id ' + connection.threadId +'</p></body></html>'));
    }    
    connection.release();
  });
});

app.listen(process.env.PORT || 8080, function () {
  console.log('node_mysql_test listening on port:' + (process.env.PORT || 8080));
});
