var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    instituition_name: String,
    instituition_email: String,
    email: String,
    is_approved: {
        type: Boolean,
        default: false
    },
    is_denied: {
        type: Boolean,
        default: false
    },
    is_instituition_email_confirmed: {
        type: Boolean,
        default: false
    },
    is_google_account: {
        type: Boolean,
        default: false
    },
    is_facebook_account: {
        type: Boolean,
        default: false
    },
    is_signup_process_complete: {
        type: Boolean,
        default: false
    },
    profile_image_url: String,
    student_proof_image_url: String,
    date_of_birth: Date,
    expiry_date: Date,
    password: String, //MD5
    google_id: String,
    facebook_id: String,
    gender: String,
    deals_redeemed: [
        {
            deal_id: String,
            date_redeemed: {
                type: Date,
                default: Date.now
            }
        }
    ],
    favourite_deals: [
        {
            deal_id: String,
            date_favourited: {
                type: Date,
                default: Date.now
            }
        }
    ],
    notifications: [
        {
            title: String,
            text: String,
            image_url: String,
            notification_type: String,
            deal_id: String,
            date_created: {
                type: Date,
                default: Date.now
            }
        }
    ],
    user_settings: {
        push_notifications_enabled: { type: Boolean, default: true }
    }
});

var User = module.exports = mongoose.model("users", userSchema);

module.exports.get = function(callback, limit){
    User.find(callback).limit(limit);
};