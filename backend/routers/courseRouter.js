var express = require('express')
var courseController = require('../controller/courseControllerMongo')
var courseControllerKafka = require('../../Kafka/client/controller/course')
var authController = require('../controller/authControllerMongo');
const router = express.Router()

router.route('/api/courses/:courseid/announcements')
.get(authController.requireSignin, courseControllerKafka.getAnnouncements)
.post(authController.requireSignin, courseControllerKafka.createAnnouncement)

router.route('/api/courses/:courseid/assignments/:assignmentid/submissions')
.get(authController.requireSignin, courseControllerKafka.getAssignmentSubmissions)

router.route('/api/courses/:courseid/assignments/:assignmentid/allsubmissions')
.get(authController.requireSignin, courseControllerKafka.getAssignmentAllSubmissions)

router.route('/api/courses/:courseid/assignments/:assignmentid')
.get(authController.requireSignin, courseControllerKafka.getAssignmentDetail)

router.route('/api/courses/:courseid/assignments')
.get(authController.requireSignin, courseControllerKafka.getAssignments)
.post(authController.requireSignin, courseControllerKafka.createAssignment)

router.route('/api/courses/:courseid/people')
.get(authController.requireSignin, courseControllerKafka.getPeople)
.delete(authController.requireSignin, courseControllerKafka.removePeople)

router.route('/api/courses/:courseid/quizzes')
.get(authController.requireSignin, courseControllerKafka.getQuizzes)
.post(authController.requireSignin, courseControllerKafka.createQuiz)

router.route('/api/courses/:courseid/files/:filename')
.get(courseController.getFile)

router.route('/api/courses/:courseid/submissions')
.get(courseController.getSubmissionFile)
.post(authController.requireSignin, courseController.createSubmission)
.put(authController.requireSignin, courseControllerKafka.gradeSubmission)

router.route('/api/courses/:courseid/grades')
.get(authController.requireSignin, courseControllerKafka.getCourseGrades)

router.route('/api/courses/:courseid/files')
.post(authController.requireSignin, courseController.createFile)
.get(authController.requireSignin, courseController.getFilesList)

router.route('/api/courses/search')
.post(authController.requireSignin, courseControllerKafka.searchCourse)

router.route('/api/courses/enroll')
.post(authController.requireSignin, courseControllerKafka.enrollCourse)

router.route('/api/courses/wait')
.post(authController.requireSignin, courseControllerKafka.waitCourse)

router.route('/api/courses/drop')
.post(authController.requireSignin, courseControllerKafka.dropCourse)

router.route('/api/courses')
.post(authController.requireSignin, courseControllerKafka.createCourse)

module.exports = {router}