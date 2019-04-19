var db = require('../lib/mongoDB')
var filesize = require('filesize')
var path = require('path')
var formidable = require('formidable')
var fs = require('fs')


const randomFilename = () => {
    return Math.random().toString(36).substring(6);
}

const searchCourse = (req, res) => {
    console.log('Course search request')
    let {userid, term, name, courseid, op} = req.body;
    let query = {}
    if (term !== '') {
        query.term =  term;
    }
    if (name !== '') {
        query.name = name;
    }
    if (courseid !== '') {
        if (op === '' || op === '=') {
            query.course_id = courseid;
        } else if (op === '>=') {
            query.course_id = {$gte: courseid};
        } else if (op === '<=') {
            query.course_id = {$lte: courseid};
        }
    }
    console.log('query is: ', query)
    db.query(query)
    .then(courses => {
        console.log('search courses reuslt: ', courses)
        promises = courses.map( course => {
            course.id = course.course_id;
            return db.findCourseStatus(userid, course.course_id).then(status => {
                console.log('course status from db is: ', status);
                course = course.toObject();
                course.status = status;
                return course;
            })
        })
        
        Promise.all(promises).then(result => {
            console.log('send search courses result: ', result)
            res.status(200).json(result)
        })
    })
}

const enrollCourse = (req, res) => {
    console.log('Course enroll request')
    let {userid, courseid, permissionCode} = req.body
    db.findCourseByID(courseid).then(course => {
        if (course.occupied >= course.capacity) {
            return res.status(400).json({enrollment:'Course is full at this moment'})
        }
        if (course.needCode === 'true') {
            if (permissionCode === '') {
                return res.status(400).json({enrollment:'Please provide a permission code'})
            } else {
                db.findPermissionCode(userid, courseid)
                .then(result => {
                    console.log('permissoncode result: ', result);
                    if (result === null) {
                        return res.status(400).json({enrollment: 'Please ask permission code for current course first'})
                    } else if (result.code !== permissionCode) {
                        return res.status(400).json({enrollment: 'Please provide the correct permission code for current course'})
                    } else {
                        db.destoryPermissionCode(userid, courseid)
                        .then(() => {
                            return db.enrollCourseByID(courseid);
                        }).then(course => {
                            return db.bindUserCourse(userid, course);
                        }).then(() => {
                            return res.status(200).json({enrollment: 'Enroll course successfully'}); 
                        })
                    }
                })
            }
        } else {
            db.enrollCourseByID(courseid)
            .then(course => {
                db.bindUserCourse(userid, course)
                .then(() => {
                    return res.status(200).json({enrollment: 'Enroll course successfully'})
                })
            })  
        }
    })
}

const waitCourse = (req, res) => {
    console.log('Course wait request')
    let {userid, courseid} = req.body
    db.findCourseByID(courseid)
    .then(course => {
        if (course.waiting >= course.waitlistCapacity) {
            return res.status(400).json({enrollment:'Waiting list is full at this moment'})
        }
        db.waitCourseByID(courseid)
        .then(course => {
            db.bindUserCourse(userid, course)
            .then(() => {
                return res.status(200).json({enrollment: 'Wait course successfully'})
            })
        })
    })
}

const createCourse = (req, res) => {
    let {userid, course} = req.body
    console.log('Course create request, course is: ', course)
    db.findCourseByID(course.id)
    .then(result => {
        if (result.length > 0) {
            return res.status(400).json({error: 'Course with same ID exists, please specify another courseID'})
        }
        db.findUserByID(userid)
        .then(user => {
            course.course_id = course.id
            course.occupied = 0
            course.waiting = 0
            course.instructor = user[0].name
            course.needCode = 'false'
            console.log('insert course: ', course)
            db.insertCourse(course)
            .then((result) => {
                console.log('insert course result: ', result)
                db.bindUserCourse(userid, result)
                .then(() => {
                    return res.status(200).json({success: 'Create course successful'})
                })
            })
        })
    })
}

const getAnnouncements = (req, res) => {
    let {courseid} = req.params
    console.log('in getAnnouncements courseid type is: ', typeof courseid);
    console.log('Course announcements list request with course_id: ', courseid);
    db.findAnnouncementsByCourseID(courseid)
    .then(result => {
        let announcements = result.toObject().announcements.map(announcement => {
            announcement.id = announcement.announcement_id;
            ['_id', '__v', 'announcement_id'].reduce((a, p) => {
                delete a[p];
                return a;
            }, announcement);
            return announcement;
        })
        console.log('Course announcements list: ', announcements);
        res.status(200).json(announcements)
    })
}

const createAnnouncement = (req, res) => {
    console.log('Course create announcement request')
    let {courseid} = req.params, {title, content} = req.body
    db.insertAnnouncement({
        title: title,
        content: content
    }).then(result => {
        return db.bindAnnouncementCourse(courseid, result)
    }).then(() => {
        return getAnnouncements(req, res);
    })
}

const getPeople = (req, res) => {
    let {courseid} = req.params
    console.log('Course people list request for course: ', courseid)
    db.getPeopleByCourseID(courseid)
    .then(result => {
        console.log('Course people list result: ', result.people);
        res.status(200).json(result.people)
    })
}

const removePeople = (req, res) => {
    let {courseid} = req.params, {userid} = req.query
    console.log('remove people request: ', courseid, userid)
    db.removeFromCourseByID(courseid)
    .then(course => {
        db.unbindUserCourse(userid, course)
        .then(() => {
            db.getPeopleByCourseID(courseid)
            .then(result => {
                console.log('Course people list result: ', result.people)
                res.status(200).json(result.people)
            })
        })
    })
}

const getFilesList = (req, res) => {
    let {courseid} = req.params
    console.log('Course files list request for course: ', courseid)
    db.getFilesByCourseID(courseid)
    .then(result => {
        console.log('Course files list result: ', result)
        res.status(200).json(result.files)
    })
}

const createFile = (req, res) => {
    let {courseid} = req.params
    console.log('Course file upload request for course: ', courseid)
    let filepath = path.join(__dirname, '../public/courses/' + courseid + '/files/')
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath, {recursive: true})
    }
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.uploadDir = filepath
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'File could not be uploaded'
            })
        }
        if (files.upload) {
            filepath += files.upload.name
            fs.rename(files.upload.path, filepath, err => {
                if (err) {
                   return  console.log(err)
                }
                fs.stat(filepath, (err, stats) => {
                    if (err) {
                        return  console.log(err)
                    }
                    console.log('file size is: ', filesize(stats.size, {base: 10}))
                    db.insertFiles({
                        course_id : courseid, 
                        filename: files.upload.name, 
                        size: filesize(stats.size, {base: 10})
                    })
                    .then(() => {
                        db.getFilesByCourseID(courseid)
                        .then(result => {
                            res.status(200).json(result.files);
                        })
                    })
                })
            })
        }
    })
}

const getFile = (req, res) => {
    let {courseid, filename} = req.params
    console.log('Course file request for course and file: %s %s', courseid, filename)
    const filepath = path.join(__dirname, '../public/courses/' + courseid + '/files/' + filename)
    console.log('requested file path: ', filepath)
    res.status(200).sendFile(filepath)
}

const getSubmissionFile = (req, res) => {
    let {courseid} = req.params
    let userid = req.query.userid, filename = req.query.filename
    const filepath = path.join(__dirname, '../public/courses/' + courseid + '/submissions/' + userid + '/' + filename)
    console.log('submission file request path:', filepath)
    res.status(200).sendFile(filepath)
}

const createSubmission = (req, res) => {
    let {courseid} = req.params
    let {userid, assignmentid} = req.query
    let form = new formidable.IncomingForm()
    let filepath = path.join(__dirname, '../public/courses/' + courseid + '/submissions/' + userid + '/')
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath, {recursive: true})
    }
    form.keepExtensions = true
    form.uploadDir = filepath
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'File could not be uploaded'
            })
        }
        if (files.submission) {
            files.submission.name = (randomFilename() + '-') + files.submission.name;
            filepath += files.submission.name;
            fs.rename(files.submission.path, filepath, err => {
                if (err) {
                   return  console.log(err)
                }
                let mimetype = files.submission.type.split('/').pop()
                if (mimetype === `vnd.openxmlformats-officedocument.wordprocessingml.document`)
                    mimetype = 'docx'
                let submission = {
                    user_id: userid,
                    assignment_id: assignmentid,
                    filename: files.submission.name,
                    mimetype
                }
                db.createSubmission(submission)
                .then(() => {
                    db.getSubmissons(userid, assignmentid)
                    .then(result => {
                        res.status(200).json(result)
                    })
                })
            })
        }
    })
}

const gradeSubmission = (req, res) => {
    let {userid, assignmentid} = req.query, {submissionid, grades} = req.body
    console.log('grade submission request, userid, assignmentid, submissionid, grades: ', userid, assignmentid, submissionid,grades)
    db.updateGrades(grades, userid, assignmentid, submissionid)
    .then(() => {
        db.getAllSubmissons(assignmentid)
        .then(result => {
            let assignment = result.toObject();
            let promises = assignment.submissions.map(submission => {
                return db.findUserByID(submission.user_id)
                    .then(user => ({
                            userid: user[0].user_id,
                            username: user[0].name,
                            submissionid: submission.submission_id,
                            filename: submission.filename,
                            mimetype: submission.mimetype,
                            grades: submission.grades,
                            points: assignment.points,
                        }))
            })
            Promise.all(promises).then(submissions => {
                console.log('Assignment all submissions result: ', submissions)
                res.status(200).json(submissions)
            })
        })
    })
}

const getAssignments = (req, res) => {
    let {courseid} = req.params
    console.log('in getAssignments courseid type is: ', typeof courseid);
    db.getAssignmentsByCourseID(courseid)
    .then(result => {
        let assignments = result.toObject().assignments.map(assignment => {
            assignment.id = assignment.assignment_id;
            ['_id', '__v', 'assignment_id'].reduce((a, p) => {
                delete a[p];
                return a;
            }, assignment);
            return assignment;
        })
        console.log('Course assignments list: ', assignments);
        res.status(200).json(assignments)
    })
}

const createAssignment = (req, res) => {
    let {courseid} = req.params;
    db.insertAssignment(courseid, (({title, due, points, content}) => ({title, due, points, content}))(req.body))
    .then(() => {
        return getAssignments(req, res);
    })
}

const getAssignmentDetail = (req, res) => {
    let {assignmentid} = req.params
    console.log('Assignment detail request: ', assignmentid)
    db.getAssignmentByID(assignmentid)
    .then(assignment => {
        console.log('Assignment detail result: ', assignment)
        res.status(200).json(assignment)
    })
}

const getAssignmentSubmissions = (req, res) => {
    let {assignmentid} = req.params
    let userid = req.query.userid
    console.log('Assignment submissions request: ', userid, assignmentid)
    db.getSubmissons(userid, assignmentid)
    .then(result => {
        console.log('Assignment submissions result: ', result)
        res.status(200).json(result)
    })
}

const getAssignmentAllSubmissions = (req, res) => {
    let {assignmentid} = req.params
    console.log('Assignment all submissions request, assignmentid is:', assignmentid)
    db.getAllSubmissons(assignmentid)
    .then(result => {
        let assignment = result.toObject();
        let promises = assignment.submissions.map(submission => {
            return db.findUserByID(submission.user_id)
                   .then(user => ({
                        userid: user[0].user_id,
                        username: user[0].name,
                        submissionid: submission.submission_id,
                        filename: submission.filename,
                        mimetype: submission.mimetype,
                        grades: submission.grades,
                        points: assignment.points,
                    }))
        })
        Promise.all(promises).then(submissions => {
            console.log('Assignment all submissions result: ', submissions)
            res.status(200).json(submissions)
        })
    })
}

const getQuizzes = (req, res) => {
    let {courseid} = req.params
    console.log('Course quizzes request: ', courseid)
    db.getQuizzesByCoureseID(courseid)
    .then(result => {
        console.log('Course quizzes result: ', result)
        res.status(200).json(result.quizzes)
    })
}

const createQuiz = (req, res) => {
    let {courseid} = req.params, {title, description, available, until, due, duration, points, questions} = req.body
    db.createQuiz(courseid, {title, description, available, until, due, duration, points, questions})
    .then(() => {
        res.status(200).end()
    })
}

const getCourseGrades = (req, res) => {
    let {courseid} = req.params, {userid} = req.query
    db.getCourseAssignmentsGrades(courseid, userid)
    .then(grades => {
        let m = new Map()
        grades.forEach(element => {
            if (!m.has(element.assignmentid)) {
                m.set(element.assignmentid, element)
            } else {
                let grade = m.get(element.assignmentid).grades
                if (grade === null || grade < element.grades)
                    m.set(element.assignmentid, element)
            }
        })
        grades = Array.from(m.values())
        console.log('get assignments grades result: ', grades);
        db.getCourseQuizzesGrades(courseid, userid)
        .then(grades2 => {
            res.status(200).json(grades.concat(grades2))
        })
       //res.status(200).json([]);
    })
}

module.exports = {
        searchCourse, enrollCourse, waitCourse, createCourse,
        getAnnouncements, createAnnouncement,
        getPeople, removePeople,
        getFilesList, createFile, getFile,
        getAssignments, createAssignment, getAssignmentDetail, getAssignmentSubmissions, getAssignmentAllSubmissions,
        getSubmissionFile, createSubmission, gradeSubmission,
        getQuizzes, createQuiz,
        getCourseGrades
    }