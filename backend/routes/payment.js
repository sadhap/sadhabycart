const express = require('express')
const {processPayment,sendStripeApi}=require('../controllers/paymentController');
const {isAuthenticateUser}= require('../middlewares/authenticate');
const router = express.Router();

router.route('/payment/process').post(isAuthenticateUser,processPayment);
router.route('/stripeapi').get(sendStripeApi);

module.exports = router;