var express = require('express')
//var userController = require('../controller/userController')
var userController = require('../controller/userControllerMongo')
var authController = require('../controller/authControllerMongo')
var userControllerKafka = require('../../Kafka/client/controller/user');

const router = express.Router()

router.route('/api/users')
.post(userControllerKafka.creatUser)

router.route('/api/users/photo/:userID')
.get(userController.getPhoto)

router.route('/api/users/courses/:userID')
.get(authController.requireSignin, userControllerKafka.getUserCourses)

router.route('/api/users/:userID')
.get(authController.requireSignin, userControllerKafka.getUser)
.put(authController.requireSignin, userController.updateUser)

router.route('/api/users/messages/:userID')
.get(authController.requireSignin, userControllerKafka.getUserMessages)
.post(authController.requireSignin, userControllerKafka.createUserMessage)
.put(authController.requireSignin, userControllerKafka.readMessage)

module.exports = {router}