var mongoose = require('mongoose');

var dealSchema = mongoose.Schema({
    name: String,
    description: String,
    deal_type: {
        type: String,
        default: 'Value'
    }, //Percentage Discount/Other
    store_name: String,
    category: String,
    available_online: {
        type: Boolean,
        default: false
    },
    is_main: {
        type: Boolean,
        default: false
    },
    is_trending: {
        type: Boolean,
        default: false
    },
    is_special: {
        type: Boolean,
        default: false
    },
    is_week_pick: {
        type: Boolean,
        default: false
    },
    is_visible: {
        type: Boolean,
        default: true
    },
    percentage: Number,
    image_url: String,
    store_id: String,
    store_logo_url: String,
    date_created: {
        type: Date,
        default: Date.now
    },
    usage_interval_hours: {
        type: Number,
        default: 48
    },
});

var Deal = module.exports = mongoose.model("deal", dealSchema);

module.exports.get = function(callback, limit){
    Deal.find(callback).limit(limit);
};