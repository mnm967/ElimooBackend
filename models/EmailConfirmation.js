var mongoose = require('mongoose');

var emailConfirmationSchema = mongoose.Schema({
    user_id: String,
    user_email: String,
    secret_pin: String, //MD5
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

var EmailConfirmation = module.exports = mongoose.model("email_confirmation", emailConfirmationSchema);

module.exports.get = function(callback, limit){
    EmailConfirmation.find(callback).limit(limit);
};