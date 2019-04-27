var express = require('express')
var authController = require('../controller/authController')
var userControllerLocal = require('../controller/userController')
var userControllerKafka = require('../../kakfa/client/controller/user');
const answerRouter = express.Router()

router.route('/api/bookmark/user/:userID/answer/:answerID')
.post(authController.requireSignin,)

router.route('/api/answer/:answerID/upvote')
.put(authController.requireSignin,)

router.route('/api/answer/:answerID/downvote')
.put(authController.requireSignin,)

router.route('/api/answer_votes/:answerID')
.get(authController.requireSignin,)

router.route('/api/answer/:answerID/comment')
.post(authController.requireSignin,)

router.route('/api/answer/:answerID/all_comments')
.get(authController.requireSignin,)

router.route('/api/question/:questionID/answer')
.post(authController.requireSignin,)

router.route('/api/question/:questionID/answer/:answerID')
.put(authController.requireSignin,)
.get(authController.requireSignin,)


router.route('/api/users/courses/:userID')
.get(authController.requireSignin, userControllerKafka.getUserCourses)

router.route('/api/users/:userID')
.get(authController.requireSignin, userControllerKafka.getUser)
.put(authController.requireSignin, userControllerLocal.updateUser)

router.route('/api/users/messages/:userID')
.get(authController.requireSignin, userControllerKafka.getUserMessages)
.post(authController.requireSignin, userControllerKafka.createUserMessage)
.put(authController.requireSignin, userControllerKafka.readMessage)

module.exports = {answerRouter}