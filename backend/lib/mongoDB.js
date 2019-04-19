var mongoose = require('mongoose')
var User = require('../models/user')
var Course = require('../models/course')
var Announcement = require('../models/announcement')
var Assignment = require('../models/assignment')
var Submission = require('../models/submission')
var PermissionCode = require('../models/permissionCode')
var File = require('../models/files')
var Quiz = require('../models/quiz')
var QuizSubmission = require('../models/quizSubmission')
var Message = require('../models/message')

const uri_altas = 'mongodb+srv://admin:admin@canvas-huqgi.mongodb.net/';
const uri_local = 'mongodb://localhost:27017/canvas';
mongoose.Promise = global.Promise
mongoose.connect(uri_local, {
    dbName: 'canvas',
    useNewUrlParser: true,
    poolSize: 100,
    useFindAndModify: false,
    keepAlive: true, 
    keepAliveInitialDelay: 300000,
    useCreateIndex: true
})

mongoose.connection.once('open', () => {
    console.log('connection to mongoDB is open');
})

mongoose.connection.on('connecting', () => {
    console.log('connecting to mongoDB');
})
mongoose.connection.on('connected', () => {
    console.log('connected to mongoDB');
})
mongoose.connection.on('disconnected', () => {
    console.log('lost connection to mongoDB');
})
mongoose.connection.on('close', () => {
    console.log('connection to mongoDB was closed')
})
mongoose.connection.on('error', () => {
    throw new Error('unable to connect to mongoDB')
})


exports.insertUser = (user) => {
    let newUser = new User(user);
    return newUser.save();
}

exports.findUserByEmail = (email) => {
    console.log('findUserByEmail: ', email);
    return User.find({email: email}).exec();
}

exports.findUserByID = (id) => {
    return User.find({user_id: id}).exec();
}

exports.findAvatarPathByID = (id) => {
    return User.findOne({user_id: id}, {'_id': 0, 'avatar': 1}).exec();
}

exports.updateUser = (user) => {
    return User.findOneAndUpdate({user_id: user.id}, user).exec();
}

exports.insertCourse = (course) => {
    let newCourse = new Course(course);
    return newCourse.save();
}

exports.findCoursesByUserID = (userID) => {
    return User.findOne({user_id: userID})
           .populate('courses').exec();
}

exports.findCourseByID = (id) => {
    return Course.find({course_id: id}).exec();
}

exports.findCourseStatus = (user_id, course_id) => {
    return new Promise((resolve, reject) => {
        User.findOne({user_id: user_id})
        .populate('courses')
        .exec()
        .then(user => {
            //console.log('in findCourseStatus, the user is:', user);
            let status = '';
            for (let i = 0; i < user.courses.length; i++) {
                if (user.courses[i].course_id === course_id) {
                    status = 'enrolled';
                    break;
                }
            }
            resolve(status);
        });
    });
}

exports.enrollCourseByID = (id) => {
    return Course.findOneAndUpdate({course_id: id}, {$inc: {occupied: 1}}).exec();
}

exports.dropCourseByID = (id) => {
    return Course.findOneAndUpdate({course_id: id}, {$inc: {occupied: -1}}).exec();
}

exports.waitCourseByID = (id) => {
    return Course.findOneAndUpdate({course_id: id}, {$inc: {waiting: 1}}).exec();
}

exports.bindUserCourse = (userid, course) => {
    return User.findOneAndUpdate({user_id: userid}, {$push: {courses: course._id}})
    .exec()
    .then(user => Course.findOneAndUpdate({course_id: course.course_id}, {$push: {people: user._id}}).exec());
}

exports.unbindUserCourse = (userid, course) => {
    return User.findOneAndUpdate({user_id: userid}, {$pull: {courses: course._id}})
    .exec()
    .then(user => {
        console.log('unbindUserCourse user is: ', user);
        console.log('unbindUserCourse course is: ', course);
        Course.findOneAndUpdate({course_id: course.course_id}, {$pull: {people: user._id}}).exec()
    });
}

exports.findPermissionCode = (user_id, course_id) => {
    return PermissionCode.findOne({user_id: user_id, course_id: course_id}).exec();
}

exports.createPermissionCode = (code) => {
    const newCode = new PermissionCode(code);
    return newCode.save();
}

exports.destoryPermissionCode = (user_id, course_id) => {
    return PermissionCode.findOneAndDelete({user_id: user_id, course_id: course_id}).exec();
}

exports.findAnnouncementsByCourseID = (courseid) => {
    return Course.findOne({course_id: courseid})
           .populate('announcements').exec();
}

exports.insertAnnouncement = (announcement) => {
    const newAnnouncement = new Announcement(announcement);
    return newAnnouncement.save();
}

exports.bindAnnouncementCourse = (courseid, announcement) => {
    return Course.findOneAndUpdate({course_id: courseid}, {$push: {announcements: announcement._id}}).exec();
}

exports.getPeopleByCourseID = (courseid) => {
    return Course.findOne({course_id: courseid})
    .populate({
        path: 'people',
        select: 'user_id name role -_id'
    }).select('people -_id').exec();
}

exports.insertFiles = (file) => {
    const newFile = new File(file);
    return newFile.save()
    .then(file => {
        return Course.findOneAndUpdate({course_id: file.course_id}, {$push: {files: file._id}}).exec();
    })
}

exports.getFilesByCourseID = (courseid) => {
    return Course.findOne({course_id: courseid})
    .populate({
        path: 'files',
        select: 'filename size createdate -_id'
    }).select('files -_id').exec();
}

exports.insertAssignment = (courseid, assignment) => {
    const newAssignment = new Assignment(assignment);
    return newAssignment.save()
    .then(assignment => {
        return Course.findOneAndUpdate({course_id: courseid}, {$push: {assignments: assignment._id}}).exec();
    })
}

exports.getAssignmentsByCourseID = (courseid) => {
    return Course.findOne({course_id: courseid})
           .populate('assignments').exec();
}

exports.getAssignmentByID = (assignmentid) => {
    return Assignment.findOne({assignment_id: assignmentid}).exec();
}

exports.getSubmissons = (userid, assignmentid) => {
    return Submission.find({assignment_id: assignmentid, user_id: userid}, {'_id': 0, 'filename': 1, 'submitdt':1}).exec();
}

exports.getAllSubmissons = (assignmentid) => {
    const sql = `select u.id as userid, u.name as username, s.id as submissionid, s.filename, s.mimetype, s.grades, assignments.points
                from users u join submissions s on s.user_id = u.id join assignments on assignments.id ="${assignmentid}" where s.assignment_id="${assignmentid}";`
    return Assignment.findOne({assignment_id: assignmentid})
    .populate('submissions')
    .exec();
}

exports.createSubmission = (submission) => {
    const newSubmission = new Submission(submission);
    return newSubmission.save()
    .then(result => Assignment.findOneAndUpdate(
        {assignment_id: result.assignment_id},
        {$push: {submissions: result._id}}
    ).exec());
}

exports.getQuizzesByCoureseID = (courseid) => {
    return Course.findOne({course_id: courseid})
    .populate({
        path: 'quizzes',
    }).select('quizzes -_id').exec();
}

exports.createQuiz = (courseid, quiz) => {
    const newQuiz = new Quiz(quiz);
    return newQuiz.save()
    .then(quiz => {
        return Course.findOneAndUpdate({course_id: courseid}, {$push: {quizzes: quiz._id}}).exec();
    });
}

exports.updateGrades = (grades, user_id, assignment_id, submission_id) => {
    return Submission.findOneAndUpdate({
        user_id,
        assignment_id,
        submission_id
    }, {$set : {grades: grades}})
    .exec();
}

exports.getCourseAssignmentsGrades = (courseid, userid) => {
    return Course.findOne({course_id: courseid})
        .populate({
            path: 'assignments',
            select: 'assignment_id title due points submissions -_id',
            populate: {
                path: 'submissions',
                select: 'user_id grades -_id'
            }
        }).select('assignments -_id').exec()
        .then(result => {
            console.log('getCourseAssignmentsGrades the assignmets are: ', result);
            let assignments = result.assignments.toObject();
            let res = [];
            assignments.map(assignment => {
                assignment.submissions.map(submission => {
                    if (submission.user_id === Number(userid)) {
                        let obj = {
                            assignmentid: assignment.assignment_id,
                            title: assignment.title,
                            due: assignment.due,
                            points: assignment.points,
                            grades: submission.grades
                        }
                        res.push(obj);
                    }
                });
            });
            //console.log('getCourseAssignmentsGrades the final results are: ', res);
            return new Promise((reslove, reject) => {
                reslove(res);
            });
        });
}

exports.getCourseQuizzesGrades = (courseid, userid) => {
    const sql = `select q.id as quizid, q.title, qs.grades, q.points from quizzes q join quiz_submissions qs on q.id = qs.quiz_id 
                where q.course_id="${courseid}" and qs.user_id="${userid}";`
    return Course.findOne({course_id: courseid})
        .populate({
            path: 'quizzes',
            select: 'quiz_id points submissions -_id',
            populate: {
                path: 'submissions',
                select: 'user_id grades -_id'
            }
        }).select('quizzes -_id').exec()
        .then(result => {
            console.log('getCourseQuizzesGrades the quizzes are: ', result);
            let quizzes = result.quizzes.toObject();
            let res = [];
            quizzes.map(quiz => {
                quiz.submissions.map(submission => {
                    if (submission.user_id === Number(userid)) {
                        let obj = {
                            quizid: quiz.quiz_id,
                            title: quiz.title,
                            points: quiz.points,
                            grades: submission.grades
                        }
                        res.push(obj);
                    }
                });
            });
            return new Promise((reslove, reject) => {
                reslove(res);
            });
        });
}

exports.query = (query) => {
    return Course.find(query).select('-_id course_id room instructor occupied capacity').exec();
}

exports.insertMessage = (userid, message) => {
    const newMessage = new Message(message);
    return newMessage.save()
    .then(message => {
        return User.findOneAndUpdate({user_id: userid}, {$push: {messages: message._id}}).exec();
    });
}

exports.getMessagesByUserID = (userid) => {
    return User.findOne({user_id: userid})
        .populate({
            path: 'messages',
        }).select('messages -_id').exec();
}

exports.readMessage = (messageid) => {
    return Message.findOneAndUpdate({message_id: messageid}, {$set: {status: 'readed'}}).exec();
}