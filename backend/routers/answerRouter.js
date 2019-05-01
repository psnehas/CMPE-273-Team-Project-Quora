var express = require('express')
var authController = require('../controller/authController')
var answerControllerLocal = require('../controller/answerController')
var answerControllerKafka = require('../../kakfa/client/controller/answer');
const router = express.Router()

router.route('/api/bookmark/user/:userID/answer/:answerID')
.post(authController.requireSignin, answerControllerKafka.createBookmark)

router.route('/api/answer/:answerID/upvote')
.put(authController.requireSignin, answerControllerKafka.upvote)

router.route('/api/answer/:answerID/downvote')
.put(authController.requireSignin, answerControllerKafka.downvote)

router.route('/api/answer_votes/:answerID')
.get(authController.requireSignin, answerControllerKafka.allVotes)

router.route('/api/answer/:answerID/comment')
.post(authController.requireSignin, answerControllerKafka.makeComment)

router.route('/api/answer/:answerID/all_comments')
.get(authController.requireSignin, answerControllerKafka.allComments)

router.route('/api/question/:questionID/answer')
.post(authController.requireSignin, answerControllerKafka.makeAnswer)

router.route('/api/question/:questionID/answer/:answerID')
.put(authController.requireSignin, answerControllerKafka.updateAnswer)
.get(authController.requireSignin, answerControllerKafka.getOneAnswer)

module.exports = {router}