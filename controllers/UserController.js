const User = require('../models/User');
const Deal = require('../models/Deal');
const Notification = require('../models/Notifications');
const EmailConfirmation = require('../models/EmailConfirmation');
const PasswordReset = require('../models/PasswordReset');
const nodemailer = require("nodemailer");
const otpGenerator = require('otp-generator');
const md5 = require('md5');

exports.new = function(req, res){
    var user = new User();
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.date_of_birth = new Date(req.body.dob_timestamp * 1000);

    user.save((err) => {
        if(err){
            res.json({
                status: "error",
                data: err
            });
        }else{
            res.json({
                status: "success",
                data: user._id
            });
        }
    });
};

exports.load_test = function(req, res){
    User.findById(req.params.user_id, function(err, user){
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error',
                data: err
            });
        }else{
            var deals_fav = [{'deal_id': '5edb73815853322e44779f3d'}, {'deal_id': '5edb73815853322e44779f3d'}, {'deal_id': '5edb73815853322e44779f3d'}];

            user.save(function(err){
                if(err) {
                    res.json({
                        status: "error",
                        message: 'unknown_error',
                        data: err
                    });
                }else{
                    var USER = {};
                    USER['id'] = user._id;
                    USER['first_name'] = user.first_name;
                    USER['last_name'] = user.last_name;
                    USER['instituition_name'] = user.instituition_name;
                    USER['instituition_email'] = user.instituition_email;
                    USER['is_approved'] = user.is_approved;
                    USER['is_google_account'] = user.is_google_account;
                    USER['is_facebook_account'] = user.is_facebook_account;
                    USER['is_instituition_email_confirmed'] = user.is_instituition_email_confirmed;
                    USER['profile_image_url'] = user.profile_image_url;
                    USER['date_of_birth'] = user.date_of_birth;
                    USER['gender'] = user.gender;
                    USER['user_settings'] = user.user_settings;
                    USER['student_proof_image_url'] = user.student_proof_image_url;
                    USER['expiry_date'] = user.expiry_date;

                    var pass = user.password;
                    if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
                    else USER['user_has_password'] = false;

                    res.json({
                        status: "success",
                        data: USER
                    });
                }
            });
        }
    });
};
exports.update = function(req, res){
    User.findById(req.params.user_id, function(err, user){
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error',
                data: err
            });
        }else{
            user.instituition_name = req.body.instituition_name ? req.body.instituition_name : user.instituition_name;
            user.is_approved = req.body.is_approved ? req.body.is_approved : user.is_approved;
            user.instituition_email = req.body.instituition_email ? req.body.instituition_email : user.instituition_email;

            user.save(function(err){
                if(err) {
                    res.json({
                        status: "error",
                        message: 'unknown_error',
                        data: err
                    });
                }else{
                    var USER = {};
                    USER['id'] = user._id;
                    USER['first_name'] = user.first_name;
                    USER['last_name'] = user.last_name;
                    USER['instituition_name'] = user.instituition_name;
                    USER['instituition_email'] = user.instituition_email;
                    USER['is_approved'] = user.is_approved;
                    USER['is_google_account'] = user.is_google_account;
                    USER['is_facebook_account'] = user.is_facebook_account;
                    USER['is_instituition_email_confirmed'] = user.is_instituition_email_confirmed;
                    USER['profile_image_url'] = user.profile_image_url;
                    USER['date_of_birth'] = user.date_of_birth;
                    USER['gender'] = user.gender;
                    USER['user_settings'] = user.user_settings;
                    USER['student_proof_image_url'] = user.student_proof_image_url;
                    USER['expiry_date'] = user.expiry_date;

                    var pass = user.password;
                    if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
                    else USER['user_has_password'] = false;

                    res.json({
                        status: "success",
                        data: USER
                    });
                }
            });
        }
    });
};

exports.view = function(req, res){
    User.findById(req.params.user_id, 'first_name last_name instituition_name instituition_email is_approved profile_image_url date_of_birth gender user_settings is_instituition_email_confirmed is_google_account is_facebook_account student_proof_image_url password', function(err, user){
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error',
                data: err
            });
        }else{
            var USER = {};
            USER['id'] = req.params.user_id;
            USER['first_name'] = user.first_name;
            USER['last_name'] = user.last_name;
            USER['instituition_name'] = user.instituition_name;
            USER['instituition_email'] = user.instituition_email;
            USER['is_approved'] = user.is_approved;
            USER['is_instituition_email_confirmed'] = user.is_instituition_email_confirmed;
            USER['profile_image_url'] = user.profile_image_url;
            USER['date_of_birth'] = user.date_of_birth;
            USER['gender'] = user.gender;
            USER['user_settings'] = user.user_settings;
            USER['student_proof_image_url'] = user.student_proof_image_url;
            USER['expiry_date'] = user.expiry_date;

            var pass = user.password;
            if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
            else USER['user_has_password'] = false;

            res.json({
                status: 'success',
                data: USER
            });
        }
    });
};

exports.upload_profile_image = async (req, res) => {
    try{
        if(!req.files) {
            res.send({
                status: 'error',
                message: 'no_file_uploaded'
            });
        } else {
            
            let profile_image = req.files.profile_image;
            profile_image.mv('./uploads/profile_images/' + profile_image.name);

            var image_location = "https://"+req.get('host')+"/uploads/profile_images/"+profile_image.name;

            User.findById(req.params.user_id, function(err, user){
                if(err) {
                    console.log(err);
                    res.json({
                        status: "error",
                        message: 'unknown_error',
                        data: err
                    });
                }else{
                    user.profile_image_url = image_location;
                    user.save(function(err){
                        if(err) {
                            res.json({
                                status: "error",
                                message: 'unknown_error',
                                data: err
                            });
                        }else{
                            var USER = {};
                            USER['id'] = req.params.user_id;
                            USER['first_name'] = user.first_name;
                            USER['last_name'] = user.last_name;
                            USER['instituition_name'] = user.instituition_name;
                            USER['instituition_email'] = user.instituition_email;
                            USER['is_approved'] = user.is_approved;
                            USER['is_instituition_email_confirmed'] = user.is_instituition_email_confirmed;
                            USER['profile_image_url'] = user.profile_image_url;
                            USER['date_of_birth'] = user.date_of_birth;
                            USER['gender'] = user.gender;
                            USER['user_settings'] = user.user_settings;
                            USER['student_proof_image_url'] = user.student_proof_image_url;
                            USER['expiry_date'] = user.expiry_date;

                            var pass = user.password;
                            if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
                            else USER['user_has_password'] = false;

                            res.send({
                                status: 'success',
                                message: 'file_uploaded',
                                data: USER
                            });
                        }
                    });
                }
            });
        }
    }catch(err){
        console.log(err);
        res.json({
            status: "error",
            message: 'unknown_error',
            data: err
        });
    }
};

exports.upload_proof_image = async (req, res) => {
    try{
        if(!req.files) {
            res.send({
                status: 'error',
                message: 'no_file_uploaded'
            });
        } else {
            
            let proof_image = req.files.proof_image;
            proof_image.mv('./uploads/student_proof_images/' + proof_image.name);

            var image_location = "http://"+req.get('host')+"/uploads/student_proof_images/"+proof_image.name;

            User.findById(req.params.user_id, function(err, user){
                if(err) {
                    console.log(err);
                    res.json({
                        status: "error",
                        message: 'unknown_error',
                        data: err
                    });
                }else{
                    user.student_proof_image_url = image_location;
                    user.is_signup_process_complete = true;
                    user.save(function(err){
                        if(err) {
                            res.json({
                                status: "error",
                                message: 'unknown_error',
                                data: err
                            });
                        }else{
                            var USER = {};
                            USER['id'] = req.params.user_id;
                            USER['first_name'] = user.first_name;
                            USER['last_name'] = user.last_name;
                            USER['instituition_name'] = user.instituition_name;
                            USER['instituition_email'] = user.instituition_email;
                            USER['is_approved'] = user.is_approved;
                            USER['is_instituition_email_confirmed'] = user.is_instituition_email_confirmed;
                            USER['profile_image_url'] = user.profile_image_url;
                            USER['date_of_birth'] = user.date_of_birth;
                            USER['gender'] = user.gender;
                            USER['user_settings'] = user.user_settings;
                            USER['student_proof_image_url'] = user.student_proof_image_url;
                            USER['expiry_date'] = user.expiry_date;

                            var pass = user.password;
                            if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
                            else USER['user_has_password'] = false;

                            res.send({
                                status: 'success',
                                message: 'file_uploaded',
                                data: USER
                            });
                        }
                    });
                }
            });
        }
    }catch(err){
        console.log(err);
        res.json({
            status: "error",
            message: 'unknown_error',
            data: err
        });
    }
};

exports.email_confirmation = function(req, res){
    //Delete if an entry exists for user
    EmailConfirmation.deleteMany({user_id: req.params.user_id}, function(err){
        
    });
    var USER = {};
    User.findById(req.params.user_id, function(err, user){
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error',
                data: err
            });
        }else{
            user.instituition_email = req.body.instituition_email;

            user.save(function(err){
                if(err) {
                    res.json({
                        status: "error",
                        message: 'unknown_error'
                    });
                }else{
                    USER['id'] = user._id;
                    USER['first_name'] = user.first_name;
                    USER['last_name'] = user.last_name;
                    USER['instituition_name'] = user.instituition_name;
                    USER['instituition_email'] = user.instituition_email;
                    USER['is_approved'] = user.is_approved;
                    USER['is_google_account'] = user.is_google_account;
                    USER['is_facebook_account'] = user.is_facebook_account;
                    USER['is_instituition_email_confirmed'] = user.is_instituition_email_confirmed;
                    USER['profile_image_url'] = user.profile_image_url;
                    USER['date_of_birth'] = user.date_of_birth;
                    USER['gender'] = user.gender;
                    USER['user_settings'] = user.user_settings;
                    USER['student_proof_image_url'] = user.student_proof_image_url;
                    USER['expiry_date'] = user.expiry_date;

                    var pass = user.password;
                    if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
                    else USER['user_has_password'] = false;

                    var instituition_email = user.instituition_email;

                    var code = otpGenerator.generate(6, {digits: true, alphabets: false, upperCase: false, specialChars: false});
                    console.log("The Correct Pin is: ", code);
                    var encrypted_code = md5(code+"");

                    var expiryDate = new Date();
                    expiryDate.setHours(expiryDate.getHours() + 24);

                    var emailConfirmation = new EmailConfirmation();
                    emailConfirmation.user_id = req.params.user_id;
                    emailConfirmation.user_email = instituition_email;
                    emailConfirmation.secret_pin = encrypted_code;
                    emailConfirmation.expiryDate = expiryDate;

                    emailConfirmation.save(function(err){
                        if(err){
                            res.json({
                                status: 'error',
                                message: 'unknown_error'
                            });
                        }else{
                            res.json({
                                status: 'success',
                                message: 'email_sent',
                                data: USER
                            });
                            return;
                            var html = `"<html>
                            <head>
                            <title></title>
                            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                            <style type="text/css">
                                /* FONTS */
                                @media screen {
                                    @font-face {
                                      font-family: 'Lato';
                                      font-style: normal;
                                      font-weight: 400;
                                      src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                    }
                                    
                                    @font-face {
                                      font-family: 'Lato';
                                      font-style: normal;
                                      font-weight: 700;
                                      src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                    }
                                    
                                    @font-face {
                                      font-family: 'Lato';
                                      font-style: italic;
                                      font-weight: 400;
                                      src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                    }
                                    
                                    @font-face {
                                      font-family: 'Lato';
                                      font-style: italic;
                                      font-weight: 700;
                                      src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                    }
                                }
                                
                                /* CLIENT-SPECIFIC STYLES */
                                body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                                table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                                img { -ms-interpolation-mode: bicubic; }

                                /* RESET STYLES */
                                img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                                table { border-collapse: collapse !important; }
                                body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

                                /* iOS BLUE LINKS */
                                a[x-apple-data-detectors] {
                                    color: inherit !important;
                                    text-decoration: none !important;
                                    font-size: inherit !important;
                                    font-family: inherit !important;
                                    font-weight: inherit !important;
                                    line-height: inherit !important;
                                }

                                /* ANDROID CENTER FIX */
                                div[style*="margin: 16px 0;"] { margin: 0 !important; }
                            </style>
                            </head>
                            <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">

                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <!-- LOGO -->
                                <tr>
                                    <td bgcolor="#FF9E02" align="center">
                                        <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                            <tr>
                                                <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                                                    <a href="http://www.elimoo.co.za/" target="_blank">
                                                        <img alt="Logo" src="https://www.elimoo.co.za/uploads/img/icon.png" width="100" height="100" style="display: block;  font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;" border="0">
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- HERO -->
                                <tr>
                                    <td bgcolor="#FF9E02" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                  <h1 style="font-size: 32px; font-weight: 400; margin: 0;">Elimoo Verification</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- COPY BLOCK -->
                                <tr>
                                    <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                          <!-- COPY -->
                                          <tr>
                                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                              <p style="margin: 0;">Your Elimoo Verification Pin is:</p>
                                            </td>
                                          </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; line-height: 48px;">
                                                  <h1 style="font-size: 36px; font-weight: 800; margin: 0;">${code}</h1>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- COPY CALLOUT -->
                                <tr>
                                    <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                            <!-- HEADLINE -->
                                            <tr>
                                              <td bgcolor="#111111" align="left" style="padding: 40px 30px 20px 30px; color: #ffffff; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                                <h2 style="font-size: 24px; font-weight: 400; margin: 0;">Enter this Code in the Elimoo App to Verify your Account</h2>
                                              </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- SUPPORT CALLOUT -->
                                <tr>
                                    <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                            <!-- HEADLINE -->
                                            <tr>
                                              <td bgcolor="#FF9E02" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #fff; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                                <h2 style="font-size: 20px; font-weight: 400; color: #fff; margin: 0;">Need more help? Contact Us at support@elimoo.co.za</h2>
                                              </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <!-- FOOTER -->
                                <tr>
                                    <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                          <!-- PERMISSION REMINDER -->
                                          <tr>
                                            <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
                                              <p style="margin: 8px 0;">You received this email because you requested a verification pin. If you did not, ignore this email.</p>
                                            </td>
                                          </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            </body>
                            </html>`;
                            var transporter = nodemailer.createTransport({sendmail: true}, {
                                from: 'noreply@elimoo.com',
                                to: instituition_email,
                                subject: 'Elimoo Verification Code',
                            });
                            transporter.sendMail({
                                html: html
                            }, (err, info) => {
                                if(err){
                                    res.json({
                                        status: 'error',
                                        message: 'unknown_error',
                                        data: err
                                    });
                                }else{
                                    res.json({
                                        status: 'success',
                                        message: 'email_sent',
                                        data: info
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

exports.verify_confirmation_email = function(req, res){
    var encrypted_pin = req.body.encrypted_pin;
    var user_id = req.body.user_id;

    EmailConfirmation.findOne({'user_id': user_id}, (err, emailConfirmation) => {
        if(err){
            res.json({
                status: 'error',
                message: 'unknown_error',
                data: err
            });
        }else{
            if(!emailConfirmation){
                res.json({
                    status: 'error',
                    message: 'pin_not_found'
                });
            }
            var currentDate = new Date();
            if(currentDate.getTime() > emailConfirmation.expiryDate.getTime()){
                res.json({
                    status: 'error',
                    message: 'pin_expired'
                });
            }else{
                if(emailConfirmation.secret_pin === encrypted_pin){
                    User.findById(req.body.user_id, function(err, user){
                        if(err) {
                            res.json({
                                status: "error",
                                message: 'unknown_error',
                                data: err
                            });
                        }else{
                            user.is_instituition_email_confirmed = true;
                            user.is_signup_process_complete = true;
                
                            user.save(function(err){
                                if(err) {
                                    res.json({
                                        status: "error",
                                        message: 'unknown_error',
                                        data: err
                                    });
                                }else{
                                    EmailConfirmation.deleteMany({user_id: req.body.user_id}, function(err){

                                    });

                                    var USER = {};
                                    USER['id'] = user._id;
                                    USER['first_name'] = user.first_name;
                                    USER['last_name'] = user.last_name;
                                    USER['instituition_name'] = user.instituition_name;
                                    USER['instituition_email'] = user.instituition_email;
                                    USER['is_approved'] = user.is_approved;
                                    USER['is_google_account'] = user.is_google_account;
                                    USER['is_facebook_account'] = user.is_facebook_account;
                                    USER['is_instituition_email_confirmed'] = user.is_instituition_email_confirmed;
                                    USER['profile_image_url'] = user.profile_image_url;
                                    USER['date_of_birth'] = user.date_of_birth;
                                    USER['gender'] = user.gender;
                                    USER['user_settings'] = user.user_settings;
                                    USER['student_proof_image_url'] = user.student_proof_image_url;
                                    USER['expiry_date'] = user.expiry_date;

                                    var pass = user.password;
                                    if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
                                    else USER['user_has_password'] = false;

                                    res.json({
                                        status: 'success',
                                        message: 'pin_correct',
                                        data: USER
                                    });
                                }
                            });
                        }
                    });
                }else{
                    res.json({
                        status: 'error',
                        message: 'pin_incorrect'
                    });
                }
            }
        }
    });
};


exports.user_login = function(req, res){
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({'email': email, 'password': password}, 'first_name last_name instituition_name instituition_email is_approved profile_image_url date_of_birth gender user_settings is_instituition_email_confirmed is_google_account is_facebook_account student_proof_image_url password', (err, user) => {
        if(err){
            res.json({
                status: "error",
                message: 'unknown_error'
            });
        }else{
            if(!user){
                res.json({
                    status: "error",
                    message: 'login_incorrect_data'
                });  
            }else{
                var USER = {};
                USER['id'] = user._id;
                USER['first_name'] = user.first_name;
                USER['last_name'] = user.last_name;
                USER['instituition_name'] = user.instituition_name;
                USER['instituition_email'] = user.instituition_email;
                USER['is_approved'] = user.is_approved;
                USER['is_google_account'] = user.is_google_account;
                USER['is_facebook_account'] = user.is_facebook_account;
                USER['is_instituition_email_confirmed'] = user.is_instituition_email_confirmed;
                USER['profile_image_url'] = user.profile_image_url;
                USER['date_of_birth'] = user.date_of_birth;
                USER['gender'] = user.gender;
                USER['user_settings'] = user.user_settings;
                USER['student_proof_image_url'] = user.student_proof_image_url;
                USER['expiry_date'] = user.expiry_date;

                var pass = user.password;
                if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
                else USER['user_has_password'] = false;
                
                res.json({
                    status: 'success',
                    data: USER
                });
            }
        }
    });
};

exports.user_register = function(req, res){
    User.findOne({'email': req.body.email}, (err, u) => {
        if(err) console.log(err);
        if(u){
            res.json({
                status: "error",
                message: "email_exists"
            });
        }else{
            var user = new User();
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.email = req.body.email;
            user.password = req.body.password;
            user.gender = req.body.gender;
            user.date_of_birth = req.body.date_of_birth;

            user.save((err) => {
                if(err){
                    console.log(err);
                    res.json({
                        status: "error",
                        message: 'unknown_error'
                    });
                }else{
                    var USER = {};
                    USER['id'] = user._id;
                    USER['first_name'] = user.first_name;
                    USER['last_name'] = user.last_name;
                    USER['instituition_name'] = user.instituition_name;
                    USER['instituition_email'] = user.instituition_email;
                    USER['is_approved'] = user.is_approved;
                    USER['is_google_account'] = user.is_google_account;
                    USER['is_facebook_account'] = user.is_facebook_account;
                    USER['is_instituition_email_confirmed'] = user.is_instituition_email_confirmed;
                    USER['profile_image_url'] = user.profile_image_url;
                    USER['date_of_birth'] = user.date_of_birth;
                    USER['gender'] = user.gender;
                    USER['user_settings'] = user.user_settings;
                    USER['student_proof_image_url'] = user.student_proof_image_url;
                    USER['expiry_date'] = user.expiry_date;

                    var pass = user.password;
                    if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
                    else USER['user_has_password'] = false;

                    res.json({
                        status: 'success',
                        data: USER
                    });
                }
            });
        }
    });
};
exports.user_google_login = function(req, res){
    User.findOne({'email': req.body.email}, (err, u) => {
        if(err){
            res.json({
                status: "error",
                message: 'unknown_error'
            });
            return;
        }
        if(u){
            var USER = {};
            USER['id'] = u._id;
            USER['first_name'] = u.first_name;
            USER['last_name'] = u.last_name;
            USER['instituition_name'] = u.instituition_name;
            USER['instituition_email'] = u.instituition_email;
            USER['is_approved'] = u.is_approved;
            USER['is_google_account'] = true;
            USER['is_facebook_account'] = u.is_facebook_account;
            USER['is_instituition_email_confirmed'] = u.is_instituition_email_confirmed;
            USER['profile_image_url'] = u.profile_image_url;
            USER['date_of_birth'] = u.date_of_birth;
            USER['gender'] = u.gender;
            USER['user_settings'] = u.user_settings;
            USER['student_proof_image_url'] = u.student_proof_image_url;
            USER['expiry_date'] = u.expiry_date;

            var pass = u.password;
            if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
            else USER['user_has_password'] = false;

            u.google_id = req.body.google_id;
            u.save((err, r) => {});

            res.json({
                status: 'success',
                message: 'user_exists',
                data: USER
            });
        }else{
            var user = User();

            user.email = req.body.email;
            user.last_name = req.body.last_name;
            user.first_name = req.body.first_name;
            user.google_id = req.body.google_id;
            user.is_google_account = true;

            user.save((err) => {
                if(err){
                    res.json({
                        status: "error",
                        message: 'unknown_error',
                        data: err
                    });
                }else{
                    var USER = {};
                    USER['id'] = user._id;
                    USER['first_name'] = user.first_name;
                    USER['last_name'] = user.last_name;
                    USER['instituition_name'] = user.instituition_name;
                    USER['instituition_email'] = user.instituition_email;
                    USER['is_approved'] = user.is_approved;
                    USER['is_google_account'] = user.is_google_account;
                    USER['is_facebook_account'] = user.is_facebook_account;
                    USER['is_instituition_email_confirmed'] = user.is_instituition_email_confirmed;
                    USER['profile_image_url'] = user.profile_image_url;
                    USER['date_of_birth'] = user.date_of_birth;
                    USER['gender'] = user.gender;
                    USER['user_settings'] = user.user_settings;
                    USER['student_proof_image_url'] = user.student_proof_image_url;
                    USER['expiry_date'] = user.expiry_date;

                    var pass = user.password;
                    if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
                    else USER['user_has_password'] = false;

                    res.json({
                        status: "success",
                        message: 'user_created',
                        data: USER
                    });
                }
            });
        }
    });
};
exports.user_facebook_login = function(req, res){
    if(req.body.email == null || req.body.email == undefined || req.body.email == ''){
        res.json({
            status: "error",
            message: 'facebook_email_error',
            data: err
        });
        return;
    }
    // if(req.body.email == null || req.body.email == undefined || req.body.email == '') 
    //     checkdata = {'facebook_id': req.body.facebook_id};
    User.findOne({'email': req.body.email}, (err, u) => {
        if(u){
            var USER = {};
            USER['id'] = u._id;
            USER['first_name'] = u.first_name;
            USER['last_name'] = u.last_name;
            USER['instituition_name'] = u.instituition_name;
            USER['instituition_email'] = u.instituition_email;
            USER['is_approved'] = u.is_approved;
            USER['is_google_account'] = u.is_google_account;
            USER['is_facebook_account'] = true;
            USER['is_instituition_email_confirmed'] = u.is_instituition_email_confirmed;
            USER['profile_image_url'] = u.profile_image_url;
            USER['date_of_birth'] = u.date_of_birth;
            USER['gender'] = u.gender;
            USER['user_settings'] = u.user_settings;
            USER['student_proof_image_url'] = u.student_proof_image_url;
            USER['expiry_date'] = u.expiry_date;

            var pass = u.password;
            if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
            else USER['user_has_password'] = false;

            u.facebook_id = req.body.facebook_id;
            u.save((err, r) => {});

            res.json({
                status: 'success',
                message: 'user_exists',
                data: USER
            });
        }else{
            var user = User();

            user.email = req.body.email;
            user.last_name = req.body.last_name;
            user.first_name = req.body.first_name;
            user.facebook_id = req.body.facebook_id;
            user.is_facebook_account = true;

            user.save((err) => {
                if(err){
                    res.json({
                        status: "error",
                        message: 'unknown_error',
                        data: err
                    });
                }else{
                    var USER = {};
                    USER['id'] = user._id;
                    USER['first_name'] = user.first_name;
                    USER['last_name'] = user.last_name;
                    USER['instituition_name'] = user.instituition_name;
                    USER['instituition_email'] = user.instituition_email;
                    USER['is_approved'] = user.is_approved;
                    USER['is_google_account'] = user.is_google_account;
                    USER['is_facebook_account'] = user.is_facebook_account;
                    USER['is_instituition_email_confirmed'] = user.is_instituition_email_confirmed;
                    USER['profile_image_url'] = user.profile_image_url;
                    USER['date_of_birth'] = user.date_of_birth;
                    USER['gender'] = user.gender;
                    USER['user_settings'] = user.user_settings;
                    USER['student_proof_image_url'] = user.student_proof_image_url;
                    USER['expiry_date'] = user.expiry_date;

                    var pass = user.password;
                    if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
                    else USER['user_has_password'] = false;

                    res.json({
                        status: "success",
                        message: 'user_created',
                        data: USER
                    });
                }
            });
        }
    });
};

exports.pendingcheck = function(req, res){
    User.findById(req.params.userid, 'first_name last_name instituition_name instituition_email is_approved profile_image_url date_of_birth gender user_settings is_instituition_email_confirmed is_google_account is_facebook_account student_proof_image_url password', function(err, user){
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error',
                data: err
            });
        }else{
            if(!user){
                res.json({
                    status: 'success',
                    pending_status: 'signup_denied',
                    data: null
                });
            }else{
                var USER = {};
                USER['id'] = req.params.userid;
                USER['first_name'] = user.first_name;
                USER['last_name'] = user.last_name;
                USER['instituition_name'] = user.instituition_name;
                USER['instituition_email'] = user.instituition_email;
                USER['is_approved'] = user.is_approved;
                USER['is_instituition_email_confirmed'] = user.is_instituition_email_confirmed;
                USER['profile_image_url'] = user.profile_image_url;
                USER['date_of_birth'] = user.date_of_birth;
                USER['gender'] = user.gender;
                USER['user_settings'] = user.user_settings;
                USER['student_proof_image_url'] = user.student_proof_image_url;
                USER['expiry_date'] = user.expiry_date;

                var pass = user.password;
                if(pass != null && pass != undefined && pass != '') USER['user_has_password'] = true;
                else USER['user_has_password'] = false;
                
                var pendingStatus = 'signup_waiting';
                if(user.is_approved == true) pendingStatus = 'signup_approved';

                res.json({
                    status: 'success',
                    pending_status: pendingStatus,
                    data: USER
                });
            }
        }
    });
};
exports.createNotification = (req, res) => {
    var title = req.body.title;
    var text = req.body.text;
    var type = req.body.type;
    var deal_id = req.body.deal_id;
    var store_name = req.body.store_name;

    var n = new Notification();
    n.title = title;
    n.text = text;
    n.type = type;
    n.deal_id = deal_id;
    n.store_name = store_name;

    n.save((err, r) => {
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error'
            });
        }else{
            res.json({
                status: 'success',
                message: 'notification_created'
            });
        }
    });
};
exports.getUserNotifications = (req, res) => {
    var userId = req.params.userid;
    var finalNotificationsList = [];

    Notification.find({users_read: {$ne: userId}}).sort('-date_created').limit(50).exec((err, result) => {
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error'
            });
            return;
        }
        var orList = [];
        for(i = 0; i < result.length; i++){
            if(result[i].deal_id != null || result[i].deal_id != undefined) orList.push({'_id': result[i].deal_id});
        }
        
        var finalDealList = [];

        if(orList.length == 0){
            res.json({
                status: 'success',
                data: []
            });
            return;
        }

        Deal.find({$or: orList}, (err, data) => {
            if(err){
                console.log(err);
                res.json({
                    status: "error",
                    message: 'unknown_error'
                });
            }else{
                for(i = 0; i < data.length; ++i){
                    var deal = data[i];

                    var DEAL_ITEM = {};
                    DEAL_ITEM['id'] = deal._id;
                    DEAL_ITEM['name'] = deal.name;
                    DEAL_ITEM['description'] = deal.description;
                    DEAL_ITEM['deal_type'] = deal.deal_type;
                    DEAL_ITEM['category'] = deal.category;
                    DEAL_ITEM['available_online'] = deal.available_online;
                    DEAL_ITEM['is_main'] = deal.is_main;
                    DEAL_ITEM['is_trending'] = deal.is_trending;
                    DEAL_ITEM['is_special'] = deal.is_special;
                    DEAL_ITEM['is_week_pick'] = deal.is_week_pick;
                    DEAL_ITEM['is_visible'] = deal.is_visible;
                    DEAL_ITEM['percentage'] = deal.percentage;
                    DEAL_ITEM['image_url'] = deal.image_url;
                    DEAL_ITEM['store_logo_url'] = deal.store_logo_url;
                    DEAL_ITEM['store_id'] = deal.store_id;
                    DEAL_ITEM['date_created'] = deal.date_created;
                    //DEAL_ITEM['is_user_favourite'] = true;

                    finalDealList.push(DEAL_ITEM);
                }
                for(i = 0; i < result.length; ++i){
                    var notifiction = result[i];
                    var dealItem = null;
                    if(finalDealList.filter((i) => {return i['id'] == notifiction.deal_id}).length != 0){
                        dealItem = finalDealList.filter((i) => {return i['id'] == notifiction.deal_id})[0];
                    }else{
                        continue;
                    }

                    var NOTIFICATION_ITEM = {};
                    NOTIFICATION_ITEM['id'] = notifiction._id;
                    NOTIFICATION_ITEM['type'] = notifiction.type;
                    NOTIFICATION_ITEM['title'] = notifiction.title;
                    NOTIFICATION_ITEM['text'] = notifiction.text;
                    NOTIFICATION_ITEM['store_name'] = notifiction.store_name;
                    // NOTIFICATION_ITEM['image_url'] = notifiction.image_url;
                    NOTIFICATION_ITEM['deal'] = dealItem;
                    NOTIFICATION_ITEM['date_created'] = notifiction.date_created;
                    var millisecondsAgo = (new Date().getTime() - notifiction.date_created.getTime());
                    NOTIFICATION_ITEM['millisecondsAgo'] = millisecondsAgo;

                    finalNotificationsList.push(NOTIFICATION_ITEM);
                }
                finalNotificationsList.sort(function(a, b) {
                    a = a['date_created'];
                    b = b['date_created'];
                    return a>b ? -1 : a<b ? 1 : 0;
                });
                Notification.updateMany({users_read: {$ne: userId}}, {$push: {users_read: userId}}, (err, r) => {                
                });
                res.json({
                    status: 'success',
                    data: finalNotificationsList
                });
            }
        });
    });
};
exports.change_user_password = (req, res) => {
    var userId = req.body.userId;
    var currentPassword = req.body.currentPassword;
    var newPassword = req.body.newPassword;

    User.findById(userId, 'password', function(err, user){
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error'
            });
        }else{
            if(user.password !== currentPassword){
                res.json({
                    status: "success",
                    message: 'incorrect_current_password'
                });
                return;
            }
            user.password = newPassword;

            user.save(function(err){
                if(err) {
                    res.json({
                        status: "error",
                        message: 'unknown_error'
                    });
                }else{
                    res.json({
                        status: "success",
                        message: 'password_change_success'
                    });
                }
            });
        }
    });
};


exports.forgot_password_email = function(req, res){
    //Delete if an entry exists for user
    PasswordReset.deleteMany({user_id: req.body.email}, function(err){
    });
    User.findOne({email: req.body.email}, function(err, user){
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error'
            });
        }else{
            if(!user) {
                res.json({
                    status: "success",
                    message: 'email_not_found'
                });
            }else{
                var code = otpGenerator.generate(32, {digits: true, alphabets: true, upperCase: true, specialChars: false});

                var expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 6);

                var passwordReset = new PasswordReset();
                passwordReset.user_id = user._id;
                passwordReset.user_email = req.body.email;
                passwordReset.token = code;
                passwordReset.expiryDate = expiryDate;

                passwordReset.save(function(err){
                    if(err){
                        res.json({
                            status: 'error',
                            message: 'unknown_error'
                        });
                    }else{
                        // res.json({
                        //     status: 'success',
                        //     message: 'email_sent'
                        // });
                        // return;
                        var html = `"<html>
                        <head>
                        <title></title>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <style type="text/css">
                            /* FONTS */
                            @media screen {
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 400;
                                    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
                                }
                                
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: normal;
                                    font-weight: 700;
                                    src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
                                }
                                
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 400;
                                    src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
                                }
                                
                                @font-face {
                                    font-family: 'Lato';
                                    font-style: italic;
                                    font-weight: 700;
                                    src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
                                }
                            }
                            
                            /* CLIENT-SPECIFIC STYLES */
                            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
                            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                            img { -ms-interpolation-mode: bicubic; }

                            /* RESET STYLES */
                            img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
                            table { border-collapse: collapse !important; }
                            body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; }

                            /* iOS BLUE LINKS */
                            a[x-apple-data-detectors] {
                                color: inherit !important;
                                text-decoration: none !important;
                                font-size: inherit !important;
                                font-family: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                            }

                            /* ANDROID CENTER FIX */
                            div[style*="margin: 16px 0;"] { margin: 0 !important; }
                        </style>
                        </head>
                        <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">

                        <!-- HIDDEN PREHEADER TEXT -->
                        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
                            Looks like you tried signing in a few too many times. Let's see if we can get you back into your account.
                        </div>

                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <!-- LOGO -->
                            <tr>
                                <td bgcolor="#FF9E02" align="center">
                                    <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                        <tr>
                                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                                                <a href="http://www.elimoo.co.za/" target="_blank">
                                                    <img alt="Logo" src="https://www.elimoo.co.za/uploads/img/icon.png" width="100" height="100" style="display: block;  font-family: 'Lato', Helvetica, Arial, sans-serif; color: #ffffff; font-size: 18px;" border="0">
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- HERO -->
                            <tr>
                                <td bgcolor="#FF9E02" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                        <tr>
                                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                                <h1 style="font-size: 32px; font-weight: 400; margin: 0;">Trouble signing in?</h1>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- COPY BLOCK -->
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                        <!-- COPY -->
                                        <tr>
                                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                            <p style="margin: 0;">Resetting your password is easy. Just press the button below and follow the instructions. We'll have you up and running in no time. </p>
                                        </td>
                                        </tr>
                                        <!-- BULLETPROOF BUTTON -->
                                        <tr>
                                        <td bgcolor="#ffffff" align="left">
                                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                                <table border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td align="center" style="border-radius: 3px;" bgcolor="#FF9E02"><a href="https://www.elimoo.co.za/user/reset/${code}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FF9E02; display: inline-block;">Reset Password</a></td>
                                                    </tr>
                                                </table>
                                                </td>
                                            </tr>
                                            </table>
                                        </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- COPY CALLOUT -->
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                        <!-- HEADLINE -->
                                        <tr>
                                            <td bgcolor="#111111" align="left" style="padding: 40px 30px 20px 30px; color: #ffffff; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                            <h2 style="font-size: 24px; font-weight: 400; margin: 0;">Unable to click on the button above?</h2>
                                            </td>
                                        </tr>
                                        <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#111111" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                            <p style="margin: 0;">Click on the link below or copy/paste in the address bar.</p>
                                            </td>
                                        </tr>
                                        <!-- COPY -->
                                        <tr>
                                            <td bgcolor="#111111" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                            <p style="margin: 0;"><a href="https://www.elimoo.co.za/user/reset/${code}" target="_blank" style="color: #FF9E02;">Reset Link</a></p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- SUPPORT CALLOUT -->
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                        <!-- HEADLINE -->
                                        <tr>
                                            <td bgcolor="#FF9E02" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #fff; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;" >
                                            <h2 style="font-size: 20px; font-weight: 400; color: #fff; margin: 0;">Need more help? Contact Us at support@elimoo.za</h2>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <!-- FOOTER -->
                            <tr>
                                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                                    <table border="0" cellpadding="0" cellspacing="0" width="480" >
                                        
                                        <!-- PERMISSION REMINDER -->
                                        <tr>
                                        <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;" >
                                            <p style="margin: 8px 0;">You received this email because you requested a password reset. If you did not, ignore this email.</p>
                                        </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        </body>
                        </html>";`;
                        var transporter = nodemailer.createTransport({sendmail: true}, {
                            from: 'noreply@elimoo.com',
                            to: req.body.email,
                            subject: 'Elimoo Password Reset',
                        });
                        transporter.sendMail({
                            html: html
                        }, (err, info) => {
                            if(err){
                                res.json({
                                    status: 'error',
                                    message: 'unknown_error'
                                });
                            }else{
                                res.json({
                                    status: 'success',
                                    message: 'email_sent',
                                    data: info
                                });
                            }
                        });
                    }
                });
            }
        }
    });
};