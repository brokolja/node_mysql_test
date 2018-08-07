var express = require('express');
var mysql = require('mysql');

var app = express();

var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : 'mysql1',
  user     : 'test',
  password : 'test',
  database : 'test'
});

// Behind nginx proxy use: ?nocache=true for testing...

app.get('/', function (req, res) {

  pool.getConnection(function(err, connection) {
    if (err) {
      console.error('error connecting: ' + err.stack);
    }

    console.log('connected as id ' + connection.threadId);

    res.set('Content-Type', 'text/html');
    res.send(new Buffer('<html><head><title>SHIPY - Hello World</title></head><body><p>connected as id ' + connection.threadId +'</p></body></html>'));
    
    connection.release();
  });
});

app.listen(process.env.PORT || 8080, function () {
  console.log('node_mysql_test listening on port:' + (process.env.PORT || 8080));
});
