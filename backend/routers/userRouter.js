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

router.route('/topics/:topic_id/questions')
.get(authController.requireSignin, userControllerKafka.getTopicQuestions);

router.route('/topics')
.get(authController.requireSignin, userControllerKafka.getTopics)
.post(authController.requireSignin, userControllerKafka.createTopic);

router.route('/user_avatar/:userID')
.get(userControllerLocal.getUserAvatar)
.post(authController.requireSignin, userControllerLocal.updateUserAvatar)

router.route('/profile/:userID')
.get(authController.requireSignin, userControllerKafka.getUser);

router.route('/profile/update_info')
.put(authController.requireSignin, userControllerKafka.updateUserInfo);
module.exports = {router}