const mysql = require('mysql')
var session = require('express-session');
var MYSQLStore = require('express-mysql-session')(session);

module.exports = function () {
    return {
        init: function () {
            return mysql.createConnection({
                host: 'hyunwoo.org',
                user: 'sunrinlife',
                port: 3307,
                password: 'this1ssunr1nlif3',
                database: 'sunrinlife'
            })
        },
        test_open: function (con) {
            con.connect(function (err) {
                if (err) {
                    console.error('mysql connection error :' + err);
                } else {
                    console.info('mysql is connected successfully.');
                }
            })
        }
    }
};
