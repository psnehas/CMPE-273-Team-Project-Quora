var express = require('express');
var authController = require('../controller/authController')
var questionController = require('../controller/questionController');
var questionControllerKafka = require('../../kakfa/client/controller/question');
const router = express.Router();

router.route('/addQuestion')
.post(authController.requireSignin, questionControllerKafka.insertQuestion);

router.route('/questions/:question_id')
.get(authController.requireSignin, questionControllerKafka.fetchQuestion);

router.route('/question/:question_id/follow')
.post(authController.requireSignin, questionControllerKafka.followQuestion);

module.exports={router}