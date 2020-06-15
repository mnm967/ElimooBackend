const Store = require('../models/Store');
const Deal = require('../models/Deal');
const User = require('../models/User');
const TopTip = require('../models/TopTip');
const md5 = require('md5');
const mongoose = require('mongoose')
const otpGenerator = require('otp-generator');

exports.createDeal = (req, res) => {
    var name = req.body.name;
    var description = req.body.description;
    var category = req.body.category;
    var percentage = req.body.percentage;
    var available_online = req.body.available_online;
    var image_url = req.body.image_url;
    var store_id = req.body.store_id;
    var is_main = req.body.is_main;
    var is_trending = req.body.is_trending;
    var is_special = req.body.is_special;
    var is_week_pick = req.body.is_week_pick;
    var is_visible = req.body.is_visible;

    var deal_type = 'Value';
    if(percentage != null && percentage != undefined) deal_type = 'Percentage Discount';

    var deal = new Deal();
    deal.name = name;
    deal.deal_type = deal_type;
    deal.description = description;
    deal.category = category;
    deal.percentage = percentage;
    deal.available_online = available_online;
    deal.image_url = image_url;
    deal.store_id = store_id;
    deal.is_main = is_main;
    deal.is_trending = is_trending;
    deal.is_special = is_special;
    deal.is_week_pick = is_week_pick;
    deal.is_visible = is_visible;

    deal.save((err) => {
        if(err){
            console.log(err);
            res.json({
                status: "error",
                message: 'unknown_error'
            });
        }else{
            res.json({
                status: 'success',
                message: 'deal_created'
            });
        }
    });
}
exports.createTopTip = (req, res) => {
    var name = req.body.name;
    var image_url = req.body.image_url;
    var color = req.body.color;
    var link = req.body.link;

    var tip = new TopTip();
    tip.name = name;
    tip.image_url = image_url;
    tip.color = color;
    tip.link = link;

    tip.save((err) => {
        if(err){
            console.log(err);
            res.json({
                status: "error",
                message: 'unknown_error'
            });
        }else{
            res.json({
                status: 'success',
                message: 'top_tip_created'
            });
        }
    });
}
exports.getHomeDeals = (req, res) => {
    var finalDealList = [];

    TopTip.find({}).sort('-date_created').limit(30).exec((err, topTipList) => {
        if(err){
            console.log(err);
            res.json({
                status: "error",
                message: 'unknown_error'
            });
            return;
        }
        var finalTopTipList = [];
        for(x = 0; x < topTipList.length; ++x){
            var topTip = topTipList[x];
            var TOP_TIP_ITEM = {};
            TOP_TIP_ITEM['id'] = topTip._id;
            TOP_TIP_ITEM['name'] = topTip.name;
            TOP_TIP_ITEM['image_url'] = topTip.image_url;
            TOP_TIP_ITEM['color'] = topTip.color;
            TOP_TIP_ITEM['link'] = topTip.link;
            TOP_TIP_ITEM['date_created'] = topTip.date_created;

            finalTopTipList.push(TOP_TIP_ITEM);
        }
        Deal.find({$or: [{'is_main': true}, {'is_trending': true}, {'is_special': true}, {'is_week_pick': true}]}, (err, data) => {
            if(err){
                console.log(err);
                res.json({
                    status: "error",
                    message: 'unknown_error'
                });
            }else{
                for(i = 0; i < data.length; ++i){
                    var deal = data[i];
                    if(deal.is_visible == false) continue;
    
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
                    DEAL_ITEM['is_user_favourite'] = true;
    
                    finalDealList.push(DEAL_ITEM);
                }
                res.json({
                    status: 'success',
                    data: finalDealList,
                    top_tips: finalTopTipList
                });
            }
        });
    });
}

exports.getUserFavouriteDeals = (req, res) => {
    var userId = req.params.userid;
    if(userId == '--guest-user--'){
        res.json({
            status: "success",
            data: []
        });
        return;
    }
    User.findById(userId, 'favourite_deals', (err, result) => {
        if(result.favourite_deals == null || result.favourite_deals == undefined || result.favourite_deals.length == 0){
            res.json({
                status: "success",
                data: []
            });
            return;
        }
        var orList = [];
        for(i = 0; i < result.favourite_deals.length; i++){
            orList.push({'_id': result.favourite_deals[i].deal_id});
        }
        
        var finalDealList = [];

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
                    if(deal.is_visible == false) continue;

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
                    DEAL_ITEM['is_user_favourite'] = true;

                    finalDealList.push(DEAL_ITEM);
                }
                finalDealList.sort(function(a, b) {
                    a = result.favourite_deals.filter((i) => {return i['deal_id'] == a['id']})[0]['date_favourited'];
                    b = result.favourite_deals.filter((i) => {return i['deal_id'] == b['id']})[0]['date_favourited'];
                    return a>b ? -1 : a<b ? 1 : 0;
                });
                res.json({
                    status: 'success',
                    data: finalDealList
                });
            }
        });
    });
}
exports.deal_redeem_test = (req, res) => {
    var userId = req.params.userid;
    var dealId = req.params.dealid;

    User.findById(userId, 'deals_redeemed', function(err, user){
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error'
            });
        }else{
            var newDealArr = user.deals_redeemed;
            if(newDealArr == null || newDealArr == undefined) newDealArr = [];
            newDealArr.push({'deal_id': dealId});
            user.deals_redeemed = newDealArr;

            user.save(function(err){
                if(err) {
                    res.json({
                        status: "error",
                        message: 'unknown_error'
                    });
                }else{
                    res.json({
                        status: "success"
                    });
                }
            });
        }
    });
}
exports.likeDeal = (req, res) => {
    var userId = req.params.userid;
    var dealId = req.params.dealid;

    User.findById(userId, 'favourite_deals', function(err, user){
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error'
            });
        }else{
            var newDealArr = user.favourite_deals;
            if(newDealArr == null || newDealArr == undefined) newDealArr = [];
            newDealArr.push({'deal_id': dealId});
            user.favourite_deals = newDealArr;

            user.save(function(err){
                if(err) {
                    res.json({
                        status: "error",
                        message: 'unknown_error'
                    });
                }else{
                    res.json({
                        status: "success"
                    });
                }
            });
        }
    });
}
exports.unlikeDeal = (req, res) => {
    var userId = req.params.userid;
    var dealId = req.params.dealid;

    User.findById(userId, 'favourite_deals', function(err, user){
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error'
            });
        }else{
            var newDealArr = user.favourite_deals;
            if(newDealArr == null || newDealArr == undefined) newDealArr = [];
            newDealArr = newDealArr.filter((i) => {return i['deal_id'] != dealId});
            user.favourite_deals = newDealArr;

            user.save(function(err){
                if(err) {
                    res.json({
                        status: "error",
                        message: 'unknown_error'
                    });
                }else{
                    res.json({
                        status: "success"
                    });
                }
            });
        }
    });
}
exports.checkDealAvailability = (req, res) => {
    var userId = req.params.userid;
    var dealId = req.params.dealid;

    User.findById(userId, 'deals_redeemed', function(err, user){
        console.log(err);
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error'
            });
        }else{
            Deal.findById(dealId, (err, deal) => {
                console.log(err);
                if(err){
                    console.log(err);
                    res.json({
                        status: "error",
                        message: 'unknown_error'
                    });
                }else{
                    var deals_redeemed = user.deals_redeemed;
                    if(deals_redeemed == null || deals_redeemed == undefined) deals_redeemed = [];
                        var deal_redeem_arr = deals_redeemed.filter((i) => {return i['deal_id'] == dealId});
                        if(deal_redeem_arr.length > 0){
                            var redeemDate = deal_redeem_arr[0]['date_redeemed'];
                            var now = new Date();
                            var deal_interval_hours = deal.usage_interval_hours;
                            //var diff = Math.abs(now.getTime() - redeemDate.getTime()) / 3600000;
                            var diff = now.getTime() - redeemDate.getTime();
                            if(diff < (deal_interval_hours*60*60*1000)){
                                var DATA = {};
                                DATA['millisecondsTillNextUsage'] = (deal_interval_hours*60*60*1000) - diff;
                                res.json({
                                    status: "success",
                                    message: 'usage_limit_reached',
                                    data: DATA
                                });
                            }else{
                                if(!deal.is_visible){
                                    var DATA = {};
                                    DATA['deal_id'] = deal.id;

                                    res.json({
                                        status: "success",
                                        message: 'deal_unavailable',
                                        data: DATA
                                    });
                                }else{
                                    Store.findById(deal.store_id, (err, store) => {
                                        console.log("Store", err);
                                        var public_pin = md5(store.public_pin);
                                        var private_pin = md5(store.private_pin);
                                        var qr_code = md5(store.qr_code);

                                        var DATA = {};
                                        DATA['public_pin'] = public_pin;
                                        DATA['private_pin'] = private_pin;
                                        DATA['qr_code'] = qr_code;

                                        res.json({
                                            status: "success",
                                            message: 'deal_available',
                                            data: DATA
                                        });
                                    });
                                }
                            }
                        }else{
                            if(!deal.is_visible){
                                var DATA = {};
                                DATA['deal_id'] = deal.id;
                                
                                res.json({
                                    status: "success",
                                    message: 'deal_unavailable',
                                    data: DATA
                                });
                            }else{
                                Store.findById(deal.store_id, (err, store) => {
                                    var public_pin = md5(store.public_pin);
                                    var private_pin = md5(store.private_pin);
                                    var qr_code = md5(store.qr_code);

                                    var DATA = {};
                                    DATA['public_pin'] = public_pin;
                                    DATA['private_pin'] = private_pin;
                                    DATA['qr_code'] = qr_code;

                                    res.json({
                                        status: "success",
                                        message: 'deal_available',
                                        data: DATA
                                    });
                                });
                            }
                        }
                }
            });   
        }
    });
}
exports.redeemDeal = (req, res) => {
    var userId = req.params.userid;
    var dealId = req.params.dealid;

    User.findById(userId, 'deals_redeemed', function(err, user){
        if(err) {
            res.json({
                status: "error",
                message: 'unknown_error'
            });
        }else{
            Deal.findById(dealId, (err, deal) => {
                if(err){
                    console.log(err);
                    res.json({
                        status: "error",
                        message: 'unknown_error'
                    });
                }else{
                    var deals_redeemed = user.deals_redeemed;
                    if(deals_redeemed == null || deals_redeemed == undefined) deals_redeemed = [];
                        var deal_redeem_arr = deals_redeemed.filter((i) => {return i['deal_id'] == dealId});
                        if(deal_redeem_arr.length > 0){
                            var redeemDate = deal_redeem_arr[0]['date_redeemed'];
                            var now = new Date();
                            var deal_interval_hours = deal.usage_interval_hours;
                            var diff = now.getTime() - redeemDate.getTime();
                            if(diff < (deal_interval_hours*60*60*1000)){
                                var DATA = {};
                                DATA['millisecondsTillNextUsage'] = (deal_interval_hours*60*60*1000) - diff;
                                res.json({
                                    status: "success",
                                    message: 'usage_limit_reached',
                                    data: DATA
                                });
                            }else{
                                if(!deal.is_visible){
                                    var DATA = {};
                                    DATA['deal_id'] = deal.id;

                                    res.json({
                                        status: "success",
                                        message: 'deal_unavailable',
                                        data: DATA
                                    });
                                }else{
                                    //Redeem
                                    var newDealArr = user.deals_redeemed;
                                    if(newDealArr == null || newDealArr == undefined) newDealArr = [];
                                    newDealArr = newDealArr.filter((i) => {return i['deal_id'] != dealId});
                                    newDealArr.push({'deal_id': dealId});
                                    user.deals_redeemed = newDealArr;

                                    user.save(function(err){
                                        if(err) {
                                            res.json({
                                                status: "error",
                                                message: 'unknown_error'
                                            });
                                        }else{
                                            var DATA = {};
                                            DATA['millisecondsTillNextUsage'] = (deal.usage_interval_hours*60*60*1000);

                                            res.json({
                                                status: "success",
                                                message: "deal_redeem_success",
                                                data: DATA
                                            });
                                        }
                                    }); 
                                }
                            }
                        }else{
                            if(!deal.is_visible){
                                var DATA = {};
                                DATA['deal_id'] = deal.id;
                                
                                res.json({
                                    status: "success",
                                    message: 'deal_unavailable',
                                    data: DATA
                                });
                            }else{
                                //Redeem
                                var newDealArr = user.deals_redeemed;
                                if(newDealArr == null || newDealArr == undefined) newDealArr = [];
                                newDealArr = newDealArr.filter((i) => {return i['deal_id'] != dealId});
                                newDealArr.push({'deal_id': dealId});
                                user.deals_redeemed = newDealArr;

                                user.save(function(err){
                                    if(err) {
                                        res.json({
                                            status: "error",
                                            message: 'unknown_error'
                                        });
                                    }else{
                                        var DATA = {};
                                        DATA['millisecondsTillNextUsage'] = (deal.usage_interval_hours*60*60*1000);

                                        res.json({
                                            status: "success",
                                            message: "deal_redeem_success",
                                            data: DATA
                                        });
                                    }
                                });
                            }
                        }
                }
            });   
        }
    });
}
exports.getCategoryDeals = (req, res) => {
    var category = req.body.category;
    var is_store = req.body.is_store;
    var page = (req.body.page-1);
    var dealsPerPage = 30;
    var finalDealList = [];

    var s = {category: category};
    if(is_store == 'true' || is_store == true){
        s = {store_name: category};
    }
    // category: category
    Deal.countDocuments(s, (err, total) => {
        if(err){
            res.json({
                status: "error",
                message: 'unknown_error'
            });
            return;
        }
        Deal.find(s).sort('-date_created').skip(dealsPerPage*page).limit(dealsPerPage).lean().exec((err, data) => {
            if(err){
                res.json({
                    status: "error",
                    message: 'unknown_error'
                });
                return;
            }
            for(i = 0; i < data.length; ++i){
                var deal = data[i];
                if(deal.is_visible == false) continue;

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
                DEAL_ITEM['is_user_favourite'] = true;

                finalDealList.push(DEAL_ITEM);
            }
            var message = 'not_complete';
            if((dealsPerPage*(page+1)) >= total) message ='complete';
            res.json({
                status: 'success',
                message: message,
                data: finalDealList
            });
        });
    });
}
exports.searchDeals = (req, res) => {
    var searchTerm = req.body.searchTerm;
    var page = (req.body.page-1);
    var searchType = req.body.searchType;

    var dealsPerPage = 30;

    // var s = {name: {$regex : searchTerm, $options: 'i'}};
    // if(searchType == 'store') s = {store_name: {$regex : searchTerm, $options: 'i'}};

    if(searchType == 'store'){
        var s = {name: {$regex : searchTerm, $options: 'i'}};
        var finalStoreList = [];
        Store.countDocuments(s, (err, total) => {
            if(err){
                res.json({
                    status: "error",
                    message: 'unknown_error'
                });
                return;
            }
            Store.find(s).skip(dealsPerPage*page).limit(dealsPerPage).lean().exec((err, data) => {
                if(err){
                    res.json({
                        status: "error",
                        message: 'unknown_error'
                    });
                    return;
                }
                for(i = 0; i < data.length; ++i){
                    var store = data[i];

                    var STORE_ITEM = {};
                    STORE_ITEM['id'] = store._id;
                    STORE_ITEM['name'] = store.name;
                    STORE_ITEM['logo_url'] = store.logo_url;

                    finalStoreList.push(STORE_ITEM);
                }
                var message = 'not_complete';
                if((dealsPerPage*(page+1)) >= total) message ='complete';
                res.json({
                    status: 'success',
                    message: message,
                    data: finalStoreList
                });
            });
        });
    }else{
        var s = {name: {$regex : searchTerm, $options: 'i'}};
        var finalDealList = [];
        Deal.countDocuments(s, (err, total) => {
            if(err){
                res.json({
                    status: "error",
                    message: 'unknown_error'
                });
                return;
            }
            Deal.find(s).skip(dealsPerPage*page).limit(dealsPerPage).lean().exec((err, data) => {
                if(err){
                    res.json({
                        status: "error",
                        message: 'unknown_error'
                    });
                    return;
                }
                for(i = 0; i < data.length; ++i){
                    var deal = data[i];
                    if(deal.is_visible == false) continue;

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
                    DEAL_ITEM['is_user_favourite'] = true;

                    finalDealList.push(DEAL_ITEM);
                }
                var message = 'not_complete';
                if((dealsPerPage*(page+1)) >= total) message ='complete';
                res.json({
                    status: 'success',
                    message: message,
                    data: finalDealList
                });
            });
        });
    }
}