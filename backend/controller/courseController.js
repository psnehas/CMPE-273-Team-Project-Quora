var db = require('../lib/mysql')
var filesize = require('filesize')
var path = require('path')
var formidable = require('formidable')
var fs = require('fs')

const searchCourse = (req, res) => {
    console.log('Course search request')
    let {userid, term, name, courseid, op} = req.body;
    sql = `select * from courses`
    if (term !== '') {
        sql += ` where term="${term}"`
    }
    if (name !== '') {
        if (term !== '')
            sql += ` and name="${name}"`
        else
            sql += ` where name="${name}"`
    }
    if (courseid !== '') {
        if (op === '' || op === '=') {
            if (term !== '' || name !== '')
                sql += ` and id="${courseid}"`
            else
                sql += ` where id="${courseid}"`
        } else if (op === '>=') {
            if (term !== '' || name !== '')
                sql += ` and id>="${courseid}"`
            else
                sql += ` where id>="${courseid}"`
        } else if (op === '<=') {
            if (term !== '' || name !== '')
                sql += ` and id<="${courseid}"`
            else
                sql += ` where id<="${courseid}"`
        }
    }
    sql += ';'
    console.log('query is: ', sql)
    db.query(sql)
    .then(courses => {
        console.log('search courses reuslt: ', courses)
        promises = courses.map( course => {
            return db.findCourseStatus([userid, course.id]).then(rows => {
                        console.log('query user_course table result: ', rows)
                        if (rows.length === 0) {
                            course.status = ''
                        } else {
                            course.status = rows[0].status
                        }
                        return course
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
                db.findPermissionCode([userid, courseid])
                .then(result => {
                    if (result.length === 0) {
                        return res.status(400).json({enrollment: 'Please ask permission code for current course first'})
                    } else if (result[0][permission_code] !== permissionCode) {
                        return res.status(400).json({enrollment: 'Please provide the correct permission code for current course'})
                    } else if (result[0][status] === 'used') {
                        return res.status(400).json({enrollment: 'Permisson Code has been used'})
                    } else {
                        db.destoryPermissionCode([userid, courseid])
                        .then(result => {
                            db.enrollCourseByID(courseid)
                            .then(result => {
                                db.bindUserCourse([userid, courseid, 'enrolled'])
                                .then(result => {
                                    return res.status(200).json({enrollment: 'Enroll course successfully'})
                                })
                            })  
                        })
                    }
                })
            }
        } else {
            db.enrollCourseByID(courseid)
            .then(result => {
                db.bindUserCourse([userid, courseid, 'enrolled'])
                .then(result => {
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
        if (course.waiting >= waitlistCapacity) {
            return res.status(400).json({enrollment:'Waiting list is full at this moment'})
        }
        db.waitCourseByID(courseid)
        .then(result => {
            db.bindUserCourse([userid, courseid, 'waiting'])
            .then(result => {
                return res.status(200).json({enrollment: 'Wait course successfully'})
            })
        })
    })
}

const createCourse = (req, res) => {
    console.log('Course create request')
    let {userid, course} = req.body
    db.findCourseByID(course.id)
    .then(result => {
        if (result.length > 0) {
            return res.status(400).json({error: 'Course with same ID exists, please specify another courseID'})
        }
        db.findUserByID(userid)
        .then(user => {
            course.occupied = '0'
            course.waiting = '0'
            course.instructor = user[0].name
            course.needCode = 'false'
            console.log('insert course: ', course)
            db.insertCourse(Object.values(course))
            .then(() => {
                db.bindUserCourse([userid, course.id, ''])
                .then(() => {
                    return res.status(200).json({success: 'Create course successful'})
                })
            })
        })
    })
}

const getAnnouncements = (req, res) => {
    console.log('Course announcements list request')
    let {courseid} = req.params
    db.findAnnouncementsByCourseID(courseid)
    .then(result => {
        console.log('Course announcements list result: ', result)
        res.status(200).json(result)
    })
}

const createAnnouncement = (req, res) => {
    console.log('Course create announcement request')
    let {courseid} = req.params, {title, content} = req.body
    db.insertAnnouncement([courseid, title, content])
    .then(() => {
        db.findAnnouncementsByCourseID(courseid)
        .then(result => {
            console.log('Course announcements list result: ', result)
            res.status(200).json(result)
        })
    })
}

const getPeople = (req, res) => {
    let {courseid} = req.params
    console.log('Course people list request for course: ', courseid)
    db.getPeopleByCourseID(courseid)
    .then(result => {
        console.log('Course people list result: ', result)
        res.status(200).json(result)
    })
}

const removePeople = (req, res) => {
    let {courseid} = req.params, {userid} = req.query
    console.log('remove people request: ', courseid, userid)
    db.removeFromCourseByID(courseid)
    .then(() => {
        db.unbindUserCourse([userid, courseid])
        .then(() => {
            db.getPeopleByCourseID(courseid)
            .then(result => {
                console.log('Course people list result: ', result)
                res.status(200).json(result)
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
        res.status(200).json(result)
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
                    db.insertFiles([courseid, files.upload.name, filesize(stats.size, {base: 10})])
                    .then(() => {
                        db.getFilesByCourseID(courseid)
                        .then(result => {
                            res.status(200).json(result)
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
            filepath += files.submission.name
            fs.rename(files.submission.path, filepath, err => {
                if (err) {
                   return  console.log(err)
                }
                let mimetype = files.submission.type.split('/').pop()
                if (mimetype === `vnd.openxmlformats-officedocument.wordprocessingml.document`)
                    mimetype = 'docx'
                db.createSubmission([userid, assignmentid, files.submission.name, mimetype])
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
    db.updateGrades([grades, submissionid, userid, assignmentid])
    .then(() => {
        db.getAllSubmissons(assignmentid)
        .then(result => {
            res.status(200).json(result)
        })
    })
}

const getAssignments = (req, res) => {
    let {courseid} = req.params
    db.getAssignmentsByCourseID(courseid)
    .then(result => {
        console.log('Course assignment list result: ', result)
        res.status(200).json(result)
    })
}

const createAssignment = (req, res) => {
    let {courseid} = req.params, {title, due, points, content} = req.body
    db.insertAssignment([courseid, title, content, due, points])
    .then(() => {
        db.getAssignmentsByCourseID(courseid)
        .then(result => {
            console.log('Course assignment list result: ', result)
            res.status(200).json(result)
        })
    })
}

const getAssignmentDetail = (req, res) => {
    let {assignmentid} = req.params
    console.log('Assignment detail request: ', assignmentid)
    db.getAssignmentByID(assignmentid)
    .then(result => {
        console.log('Assignment detail result: ', result)
        res.status(200).json(result[0])
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
    console.log('Assignment all submissions request: ', assignmentid)
    db.getAllSubmissons(assignmentid)
    .then(result => {
        console.log('Assignment all submissions result: ', result)
        res.status(200).json(result)
    })
}

const getQuizzes = (req, res) => {
    let {courseid} = req.params
    console.log('Course quizzes request: ', courseid)
    db.getQuizzesByCoureseID(courseid)
    .then(result => {
        console.log('Course quizzes result: ', result)
        res.status(200).json(result)
    })
}

const createQuiz = (req, res) => {
    let {courseid} = req.params, {title, description, available, until, duration, points, questions} = req.body
    db.createQuiz([courseid, title, description, available, until, duration, points, questions])
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
        db.getCourseQuizzesGrades(courseid, userid)
        .then(grades2 => {
            res.status(200).json(grades.concat(grades2))
        })
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