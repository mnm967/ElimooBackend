const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const AdminController = require('./controllers/AdminController');
const UserController = require('./controllers/UserController');

var path = __dirname + '/views/';
router.use(express.static('public'));
router.use(cookieParser());

router.get('/', (req, res) => {
    res.redirect('/admin/login')
});

router.get('/approve', (req, res) => {
    var userCookieToken = req.cookies.cookie_token;
    if(req.cookies.cookie_token === undefined){
        res.clearCookie('cookie_token')
        res.redirect('/admin/login')
    }else{
        AdminController.isTokenValid(userCookieToken, (isValid) => {
            if(isValid) res.render(path+"includes/approve.ejs")
            else res.redirect('/admin/login')
        });
    }
});

router.get('/login', (req, res) => {
    var userCookieToken = req.cookies.cookie_token;
    if(req.cookies.cookie_token === undefined){
        res.render(path+"includes/login.ejs")
    }else{
        AdminController.isTokenValid(userCookieToken, (isValid) => {
            if(isValid) res.redirect('/admin/approve')
            else res.render(path+"includes/login.ejs")
        });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('cookie_token')
    res.redirect('/admin/login')
});

router.route('/login')
    .post(AdminController.login)

router.route('/api/users/pending')
    .get(UserController.get_pending_users)

router.route('/api/user/approve')
    .post(UserController.approve_user)

router.route('/api/user/deny')
    .post(UserController.deny_user)

module.exports = router;