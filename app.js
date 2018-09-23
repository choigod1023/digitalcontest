var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var cookieSession = require('cookie-session');
var flash = require('connect-flash');
var express = require('express');
var app = require('express')();

app.use(cookieSession({
  keys: ['jang'],
  cookie: {
    maxAge: 1000 * 60 * 60 // 유효기간 1시간
  }
}));

app.use(express.static('public'));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

var isAuthenticated = function(req,res,next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
}

app.get('/myinfo',isAuthenticated,function(req,res){
    res.render('myinfo',{
        title:'My Info',
        user_info :req.user
    })
});

app.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
});


passport.use(new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
},function(req,username,password,done){
    var salt = '!@#$%!@#';
    if(username===uname && choigod1023.password == sha256(password+salt))
    {
        return done(null,{'user_id':username,});
    }else{
        return done(false,null)
    }
}))

var choigod1023 ={
    username :'chogiod1023',
    password:'182aa26ab795f9a8abbff5be0f4b8ffc00962ddf6440d5cd7c87c960dcd776f4'
}
passport.serializeUser(function(user,done){
    done(null,user);
});

passport.deserializeUser(function(user,done){
    done(null,user);
});
app.post('/login',passport.authenticate('local',{
    failureRedirect:'/login',failureFlash:true
},function(req,res){
    res.redirect('/home');
}))

app.get('/login',function(req,res){
    res.sendfile(__dirname+'/public/login.html');
})

app.listen(3000,function(){
    console.log('3000port');
})