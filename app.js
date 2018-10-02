var passport = require('passport') //passport module add
    ,
    LocalStrategy = require('passport-local').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var cookieSession = require('cookie-session');
var flash = require('connect-flash');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var sha256 = require('sha256');
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

var conn = mysql.createConnection({
    host: 'hyunwoo.org',
    user: 'sunrinlife',
    port: 3307,
    password: 'this1ssunr1nlif3',
    database: 'sunrinlife'
});

conn.connect();

app.use(cookieSession({
    keys: ['jang_node'],
    cookie: {
        maxAge: 1000 * 60 * 60 // 유효기간 1시간
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.set('views', './views');

var asdf;
let d;
var salt = 'jjang486';

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
    },
    function (req, username, password, done) {
        var data;
        var query = conn.query(`SELECT * from test WHERE accessid =\"${username}\"`, function (err, rows) {
            console.log(rows[0].accessid)
            console.log(username);
            console.log(rows[0].password)
            console.log(sha256(salt + password))
            asdf = rows[0].NAME;
            if (username === rows[0].accessid && sha256(salt + password) === rows[0].password) {

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
    callbackURL:"http://localhost:3000/auth/facebook/callback"
},
function(accessToken,refreshToken,profile,done){
    
    name = profile.displayName;
    console.log(name);
    asdf = name;
    if(name == "장준혁"){
        return done(null,{
            'user_id':asdf,
        });
    }else{
        return done(false,null);
    }
}))

var name;
passport.use('kakao-login', new KakaoStrategy({
        clientID: '79811515dddf1938551b4588b0f04f76',
        clientSecret: 'ruXMRDw3iLxTmJjomhI6EHVBBZuFe1rv',
        callbackURL: 'http://localhost:3000/oauth/kakao/callback'
    },
    function (accessToken, refreshToken, profile, done) {
        // console.log(profile);
        console.log(profile);
        name = profile.username;
        asdf = name;
        console.log(name);
        if (name === "장준혁") {
            return done(null, {
                'user_id': asdf,
            });
        } else {
            return done(false, null);
        }
    }
))

passport.serializeUser(function (user, done) {
    done(null, user)
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(express.static('public'))

app.get('/kakao', passport.authenticate('kakao-login'));

app.get('/login', function (req, res) {
    res.sendfile('./public/login.html');
})
app.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), // 인증 실패 시 401 리턴, {} -> 인증 스트레티지
    function (req, res) {
        res.redirect('/myinfo');
    });

app.get('/register', function (req, res) {
    res.sendfile('./public/register.html');
})

app.get('/facebook',passport.authenticate('facebook'));

app.get('/auth/facebook/callback',passport.authenticate('facebook',{
    failureRedirect : '/login',
    failureFlash : true
}),
function(req,res){
    res.redirect('/myinfo');
})

var id = 2;

app.post('/register', function (req, res) {
    var userid = req.body.userid;
    var shapass = sha256(salt + req.body.password);
    var name = req.body.name;
    var email = req.body.email;
    var tel = req.body.tel;

    var users = {
        'accessid': userid,
        'NAME': name,
        'EMAIL': email,
        'TEL': tel,
        'password': shapass
    }
    let d;
    var query = conn.query(`SELECT * from test WHERE accessid=\"${userid}\"`, function (err, data, fields) {
        if (err) throw err;
        d = data.length;
        if (!d) {
            var query = conn.query('insert into test set ?', users, function (err, data, field) {
                if (err) throw err;
                res.redirect('/login');
            })
        } else {
            res.render('read',{title:'회원가입 실패',pass:true})
        }
        console.log(d);
    })

})

app.get('/oauth/kakao/callback', passport.authenticate('kakao-login', {
        failureRedirect: '/login',
        failureFlash: true
    }),
    function (req, res) {
        res.redirect('/myinfo');
    })

app.get('/myinfo', isAuthenticated, function (req, res) {
    if (asdf === undefined)
        return res.redirect('/login')
    res.render('myinfo', {
        title: 'My Info',
        user_info: asdf
    })
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.listen(3000, function () {
    console.log('3000port');
})