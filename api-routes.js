const router = require('express').Router();
const UserController = require('./controllers/UserController');
const StoreController = require('./controllers/StoreController');
const DealController = require('./controllers/DealController');

router.route('/user')
    .post(UserController.new);

router.get('/', (req, res) => {
    res.json({
        status: "API is up and running",
        message: "Higher. Further. Faster."
    });
});

//Elimoo API:
//User API
router.route('/user/:user_id')
    .get(UserController.view)
    .put(UserController.update)
    .patch(UserController.update);

router.route('/user/profile_image/:user_id')
    .post(UserController.upload_profile_image);

router.route('/user/student_proof_image/:user_id')
    .post(UserController.upload_proof_image);

router.route('/user/login')
    .post(UserController.user_login);

router.route('/user/register')
    .post(UserController.user_register);

router.route('/user/googlelogin')
    .post(UserController.user_google_login);

router.route('/user/facebooklogin')
    .post(UserController.user_facebook_login);
    
router.route('/user/notifications/:userid')
    .get(UserController.getUserNotifications);

router.route('/user/create/notification')
    .post(UserController.createNotification);

router.route('/user/email_confirmation/:user_id')
    .put(UserController.email_confirmation);

router.route('/user/forgotpassword')
    .post(UserController.forgot_password_email);

router.route('/user/verify/confirmation_email')
    .post(UserController.verify_confirmation_email);

router.route('/user/pendingstatus/:userid')
    .get(UserController.pendingcheck);

router.route('/user/changepassword')
    .post(UserController.change_user_password);

router.route('/deal/home')
    .get(DealController.getHomeDeals);
router.route('/deal/favourite/:userid')
    .get(DealController.getUserFavouriteDeals);
router.route('/deal/like/:userid/:dealid')
    .get(DealController.likeDeal);
router.route('/deal/unlike/:userid/:dealid')
    .get(DealController.unlikeDeal);
router.route('/deal/availability/:userid/:dealid')
    .get(DealController.checkDealAvailability);
router.route('/deal/redeem/:userid/:dealid')
    .get(DealController.redeemDeal);
router.route('/deal/category')
    .post(DealController.getCategoryDeals);
router.route('/deal/search')
    .post(DealController.searchDeals);
//Development:
router.route('/store/create')
    .post(StoreController.createStore);

router.route('/deal/create')
    .post(DealController.createDeal);

    router.route('/toptip/create')
    .post(DealController.createTopTip);

router.route('/deal/redeemtest/:userid/:dealid')
    .get(DealController.deal_redeem_test);



module.exports = router;