var express = require('express');
var questionController = require('../controller/questionController');
var questionControllerKafka = require('../../kakfa/client/controller/question');
const router = express.Router();

router.route('/addQuestion').post(questionController.addQuestion);
//router.route('/addQuestion').post(questionControllerKafka.insertQuestion);
router.route('/questions/:question_id').get(questionController.fetchQuestion);


module.exports={router}