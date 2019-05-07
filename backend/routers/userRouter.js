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

router.route('/follow_user/:followed_user_id')
.put(authController.requireSignin, userControllerKafka.followUser);

router.route('/unfollow_user/:unfollowed_user_id')
.put(authController.requireSignin, userControllerKafka.unfollowUser);

router.route('/deactive')
.put(authController.requireSignin, userControllerKafka.deactiveUser);

router.route('/activities')
.get(authController.requireSignin, userControllerKafka.getUserActivities);

router.route('/message')
.get(authController.requireSignin, userControllerKafka.getUserMessages)
.post(authController.requireSignin, userControllerKafka.createUserMessage)

router.route('/stats')
.get(userControllerLocal.getStats);

module.exports = {router}