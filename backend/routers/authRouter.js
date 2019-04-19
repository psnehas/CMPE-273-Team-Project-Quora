var express = require('express')
//var authController = require('../controller/authController')
//var authController = require('../controller/authControllerMongo')
var authController = require('../../Kafka/client/controller/auth');
const router = express.Router()

//router.route('/signin').post(authController.signin)
router.route('/signin').post(authController.signin)

module.exports = {router}