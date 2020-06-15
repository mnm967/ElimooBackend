var mongoose = require('mongoose');

var topTipsSchema = mongoose.Schema({
    name: String,
    image_url: String,
    color: String,
    link: String,
    date_created: {
        type: Date,
        default: Date.now
    }
});

var TopTip = module.exports = mongoose.model("toptip", topTipsSchema);

module.exports.get = function(callback, limit){
    TopTip.find(callback).limit(limit);
};