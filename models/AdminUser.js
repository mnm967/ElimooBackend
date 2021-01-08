var mongoose = require('mongoose');

var adminUserSchema = mongoose.Schema({
    username: String,
    password: String,
    token: String,
});

var AdminUser = module.exports = mongoose.model("admin_users", adminUserSchema);

module.exports.get = function(callback, limit){
    AdminUser.find(callback).limit(limit);
};