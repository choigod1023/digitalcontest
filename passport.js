var passport = require('passport') //passport module add
    ,
    LocalStrategy = require('passport-local').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var MYSQLStore = require('express-mysql-session')(session);
var sha256 = require('sha256');
var options = {
    host: 'hyunwoo.org',
    user: 'sunrinlife',
    port: 3307,
    password: 'this1ssunr1nlif3',
    database: 'sunrinlife'
}
var sessionStore = new MYSQLStore(options);
var mysql_db = require('./db.js')();
var conn = mysql_db.init();
mysql_db.test_open(conn);

var salt = 'jjang486';
module.exports = () =>{
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session:true,
    passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
},
    function (req, username, password, done) {
        var data;
        var query = conn.query(`SELECT * from test WHERE accessid =\"${username}\"`, function (err, rows) {
            console.log(rows);
            console.log(username)
            if (username === rows[0].accessid && sha256(salt + password) === rows[0].password) {
                req.session.user_id = username;
                console.log(req.session.user_id);
                return done(null, {
                    'user_id': username,
                });
            } else {
                return done(false, null)
            }
        })
    }));

passport.use(new FacebookStrategy({
    clientID: '305245486944906',
    clientSecret: '8085e26f799a616db568eecd070428bc',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, done) {
        userid = profile.id;
        name = profile.displayName;

        var query = conn.query(`SELECT * from facebook WHERE ID=\"${userid}\"`, function (err, data, fields) {
            if (err) throw err;
            d = data.length;
            var users = {
                'ID': userid,
                'NAME': name
            }
            if (!d) {
                var query = conn.query('insert into facebook set ?', users, function (err, data, field) {
                    if (err) throw err;
                    return done(null, {
                        'user_id': name
                    })
                })
            } else {
                return done(null, {
                    'user_id': name
                })
            }
        })
    }))

var name;
passport.use('kakao-login', new KakaoStrategy({
    clientID: '79811515dddf1938551b4588b0f04f76',
    clientSecret: 'ruXMRDw3iLxTmJjomhI6EHVBBZuFe1rv',
    callbackURL: 'http://localhost:3000/oauth/kakao/callback'
},
    function (accessToken, refreshToken, profile, done) {
        userid = profile.id;
        name = profile.displayName;

        var query = conn.query(`SELECT * from kakao WHERE ID=\"${userid}\"`, function (err, data, fields) {
            if (err) throw err;
            d = data.length;
            var users = {
                'ID': userid,
                'NAME': name
            }
            if (!d) {
                var query = conn.query('insert into kakao set ?', users, function (err, data, field) {
                    if (err) throw err;
                    return done(null, {
                        'user_id': name
                    })
                })
            } else {
                return done(null, {
                    'user_id': name
                })
            }
        })
    }
))
passport.serializeUser(function (user, done) {
    console.log('serializeUser'+user);
    done(null, user)
});

passport.deserializeUser(function (user, done) {
    console.log('deserializeUser');
    done(null, user);
});
}