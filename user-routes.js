const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const UserController = require('./controllers/UserController');

var path = __dirname + '/views/';
router.use(express.static('public'));
router.use(cookieParser());

router.get('/reset/:token', (req, res) => {
    var token = req.params.token;
    res.render(path+"includes/resetpassword.ejs", {token: token})
});
router.route("/reset/:token")
    .post(UserController.reset_user_password)
    
module.exports = router;