var mongoose = require('mongoose');

var storeSchema = mongoose.Schema({
    name: String,
    logo_url: String,
    public_pin: String,
    private_pin: String,
    qr_code: String,
    date_joined: {
        type: Date,
        default: Date.now
    }
});

var Store = module.exports = mongoose.model("store", storeSchema);

module.exports.get = function(callback, limit){
    Store.find(callback).limit(limit);
};