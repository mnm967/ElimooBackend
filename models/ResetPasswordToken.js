var mongoose = require('mongoose');

var resetPasswordTokenSchema = mongoose.Schema({
    user_id: String,
    user_email: String,
    token: String, //MD5
    expiryDate: Date,
    status: {
        type: String,
        default: 'pending'
    },
    date_created: {
        type: Date,
        default: Date.now
    },
});

var ResetPasswordToken = module.exports = mongoose.model("reset_password_token", resetPasswordTokenSchema);

module.exports.get = function(callback, limit){
    ResetPasswordToken.find(callback).limit(limit);
};