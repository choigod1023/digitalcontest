var passport = require('passport') //passport module add
    ,
    LocalStrategy = require('passport-local').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;
var express = require('express');
var app = express();
var FacebookStrategy = require('passport-facebook').Strategy;
var cookieSession = require('cookie-session');
var flash = require('connect-flash');
var session = require('express-session');
var MYSQLStore = require('express-mysql-session')(session);
var cookieparser = require('cookie-parser');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var sha256 = require('sha256');
const route = require('./router.js');
const passportConfig = require('./passport.js');
const db = require('./db.js');

var options = {
    host: 'hyunwoo.org',
    user: 'sunrinlife',
    port: 3307,
    password: 'this1ssunr1nlif3',
    database: 'sunrinlife'
}

var sessionStore = new MYSQLStore(options);
app.use(session({
    secret: 'choigod1023',
    resave: false,
    saveUninitalized: true,
    cookie: { secure: true },
    store: sessionStore
}))

app.use(cookieparser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', route);

app.listen(3000, function () {
    console.log('asdfasdf');
})