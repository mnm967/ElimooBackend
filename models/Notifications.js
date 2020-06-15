var mongoose = require('mongoose');

var notificationSchema = mongoose.Schema({
    type: String,
    title: String,
    text: String,
    store_name: String,
    // image_url: String,
    deal_id: String,
    users_read: {
        type: [String],
        default: []
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

var Notification = module.exports = mongoose.model("notification", notificationSchema);

module.exports.get = function(callback, limit){
    Notification.find(callback).limit(limit);
};