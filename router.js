let d;
var salt = 'jjang486';
const passport = require('passport');
const express = require('express');

const router = express.Router();

router.get('/kakao', passport.authenticate('kakao-login'));

router.get('/login', function (req, res) {
    res.sendfile('./public/login.html');
})
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), // 인증 실패 시 401 리턴, {} -> 인증 스트레티지
    function (req, res) {
        console.log('허미');
        res.redirect('/myinfo');
    });

router.get('/register', function (req, res) {
    res.sendfile('./public/register.html');
})

router.get('/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
    failureFlash: true
}),
    function (req, res) {
        res.redirect('/myinfo');
    })

var id = 2;

router.post('/register', function (req, res) {
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
                req.session.userid=userid;
                res.redirect('/myinfo');
            })
        } else {
            res.render('read', { title: '회원가입 실패', pass: true })
        }
    })

})

router.get('/oauth/kakao/callback', passport.authenticate('kakao-login', {
    failureRedirect: '/login',
    failureFlash: true
}),
    function (req, res) {
        res.redirect('/myinfo');
    })

router.get('/myinfo', function (req, res) {
    console.log(passport.session);
    if (req.session.user_id === undefined){
        console.log('undefined');
        return res.redirect('/login')
    }
    res.render('myinfo', {
        title: 'My Info',
        user_info: req.session.user_id
    })
});

router.get('/',function(req,res){
    if(req.session.userid)
        res.render('main',{title:'main',user_info:req.session.userid})
    else
        res.render('main',{title:'main',user_info:"로그인하세요"})
})
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;