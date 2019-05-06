var express = require('express')
var authController = require('../controller/authController')
var answerControllerLocal = require('../controller/answerController')
var answerControllerKafka = require('../../kakfa/client/controller/answer');
const router = express.Router()

router.route('/bookmark/user/:user_id/answer/:answer_id')
.post(authController.requireSignin, answerControllerKafka.createBookmark)

router.route('/answer/:answer_id/upvote')
.put(authController.requireSignin, answerControllerKafka.upvote)

router.route('/answer/:answer_id/downvote')
.put(authController.requireSignin, answerControllerKafka.downvote)

router.route('/answer/:answer_id/comment')
.post(authController.requireSignin, answerControllerKafka.makeComment)

router.route('/answer_comments/:answer_id')
.get(authController.requireSignin, answerControllerKafka.allComments)

router.route('/question/:question_id/answer')
.post(authController.requireSignin, answerControllerKafka.makeAnswer)

router.route('/answer/:answer_id')
.put(authController.requireSignin, answerControllerKafka.updateAnswer)
.get(authController.requireSignin, answerControllerKafka.getOneAnswer)

router.route('/answer/:answer_id/owner')
.get(authController.requireSignin, answerControllerKafka.getOwnerOfAnswer)

module.exports = {router}