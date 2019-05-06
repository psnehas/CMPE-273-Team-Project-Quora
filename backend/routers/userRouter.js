var express = require('express')
var authController = require('../controller/authController')
var userControllerLocal = require('../controller/userController')
var userControllerKafka = require('../../kakfa/client/controller/user');
const router = express.Router()

router.route('/signin').post(userControllerKafka.signin);
router.route('/signup').post(userControllerKafka.signup);

router.route('/userFeed')
.get(authController.requireSignin, userControllerKafka.getUserFeed);

router.route('/userTopics')
.get(authController.requireSignin, userControllerKafka.getUserTopics)
.post(authController.requireSignin, userControllerKafka.followTopics);

router.route('/topics')
.post(authController.requireSignin, userControllerKafka.createTopic);

router.route('/api/users/photo/:userID')
.get(userControllerLocal.getPhoto)

router.route('/profile/:userID')
.get(authController.requireSignin, userControllerKafka.getUser)
.put(authController.requireSignin, userControllerLocal.updateUser)

module.exports = {router}