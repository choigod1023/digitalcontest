const mysql = require('mysql')
var session = require('express-session');
var MYSQLStore = require('express-mysql-session')(session);

var conn = mysql.createConnection({
    host: 'hyunwoo.org',
    user: 'sunrinlife',
    port: 3307,
    password: 'this1ssunr1nlif3',
    database: 'sunrinlife'
});conn.connect();

var options = {
    host: 'hyunwoo.org',
    user: 'sunrinlife',
    port: 3307,
    password: 'this1ssunr1nlif3',
    database: 'sunrinlife'
}

var sessionStore = new MYSQLStore(options);