const Store = require('../models/Store');
const md5 = require('md5');
const otpGenerator = require('otp-generator');

exports.createStore = (req, res) => {
    var name = req.body.name;
    var logo_url = req.body.logo_url;
    var publicPin = otpGenerator.generate(4, {digits: true, alphabets: false, upperCase: false, specialChars: false});
    var privatePin = otpGenerator.generate(4, {digits: true, alphabets: false, upperCase: false, specialChars: false});
    var qrPublicCode = otpGenerator.generate(20, {digits: true, alphabets: true, upperCase: true, specialChars: false});

    var store = new Store();
    store.name = name;
    store.logo_url = logo_url;
    store.public_pin = publicPin;
    store.private_pin = privatePin;
    store.qr_code = qrPublicCode;

    store.save((err) => {
        if(err){
            console.log(err);
            res.json({
                status: "error",
                message: 'unknown_error'
            });
        }else{
            res.json({
                status: 'success',
                message: 'store_created'
            });
        }
    });
}


