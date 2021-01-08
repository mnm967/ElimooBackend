const AdminUser = require('../models/AdminUser');
const md5 = require('md5');
const otpGenerator = require('otp-generator');

exports.login = function(req, res){
    var username = req.body.username;
    var password = req.body.password ? md5(req.body.password) : "";
    const path = require( 'path' ).join( __dirname, '..', 'views/includes/login.ejs' )

    AdminUser.findOne({'username' : username, 'password': password}, (err, user) => {
        if(err){
            res.render(path, {
                login_result: 'error'
            })
        }else{
            if(!user){
                res.render(path, {
                    login_result: 'failed'
                });
                return;
            }

            var token = otpGenerator.generate(32, {digits: true, alphabets: true, upperCase: true, specialChars: false});
            user.token = token
            user.save((err) => {
                if(err){
                    res.render(path, {
                        login_result: 'error'
                    });
                    return;
                }

                res.cookie('cookie_token', token, {expire: 360000 + Date.now()});
                res.redirect('/admin/approve')
            })
        }
    });
}

exports.isTokenValid = function(token, cb){
    AdminUser.findOne({'token' : token}, (err, user) => {
        if(err){
            cb(false)
        }else{
            if(!user){
                cb(false)
                return;
            }
            cb(true)
        }
    });
}