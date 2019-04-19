
var db = require('../../../Backend/lib/mongoDB')

const searchCourse = (query, userid, next) => {
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
            next(null, {
                status: 200,
                data: result
            })
        })
    })
}

const enrollCourse = (userid, courseid, permissionCode, next) => {
    db.findCourseByID(courseid).then(course => {
        if (course.occupied >= course.capacity) {
            return next(null, {
                status: 400,
                data: {enrollment:'Course is full at this moment'}
            });
        }
        if (course.needCode === 'true') {
            if (permissionCode === '') {
                return next(null, {
                    status: 400,
                    data: {enrollment:'Please provide a permission code'}
                });
            } else {
                db.findPermissionCode(userid, courseid)
                .then(result => {
                    console.log('permissoncode result: ', result);
                    if (result === null) {
                        return next(null, {
                            status: 400,
                            data: {enrollment:'Please ask permission code for current course first'}
                        });
                    } else if (result.code !== permissionCode) {
                        return next(null, {
                            status: 400,
                            data: {enrollment:'Please provide the correct permission code for current course'}
                        });
                    } else {
                        db.destoryPermissionCode(userid, courseid)
                        .then(() => {
                            return db.enrollCourseByID(courseid);
                        }).then(course => {
                            return db.bindUserCourse(userid, course);
                        }).then(() => {
                            return next(null, {
                                status: 200,
                                data: {enrollment:'Enroll course successfully'}
                            });
                        })
                    }
                })
            }
        } else {
            db.enrollCourseByID(courseid)
            .then(course => {
                db.bindUserCourse(userid, course)
                .then(() => {
                    return next(null, {
                        status: 200,
                        data: {enrollment:'Enroll course successfully'}
                    });
                })
            })  
        }
    })
}

const dropCourse = (userid, courseid, next) => {
    db.dropCourseByID(courseid)
    .then(course => {
        console.log('dropCourse from course: ', course);
        db.unbindUserCourse(userid, course)
        .then( () => {
            return next(null, {
                status: 200,
                data: {enrollment:'Drop course successfully'}
            });
        })
    })
}

const waitCourse = (userid, courseid, next) => {
    db.findCourseByID(courseid)
    .then(course => {
        if (course.waiting >= course.waitlistCapacity) {
            return next(null, {
                status: 400,
                data: {enrollment:'Waiting list is full at this moment'}
            });
        }
        db.waitCourseByID(courseid)
        .then(course => {
            db.bindUserCourse(userid, course)
            .then(() => {
                return next(null, {
                    status: 200,
                    data: {enrollment:'Wait course successfully'}
                });
            })
        })
    })
}

const createCourse = (userid, course, next) => {
    db.findCourseByID(course.id)
    .then(result => {
        if (result.length > 0) {
            return next(null, {
                status: 400,
                data: {error: 'Course with same ID exists, please specify another courseID'}
            });
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
                    return next(null, {
                        status: 200,
                        data: {success: 'Create course successful'}
                    });
                })
            })
        })
    })
}

const getAnnouncements = (courseid, next) => {
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
        return next(null, {
            status: 200,
            data: announcements
        });
    })
}

const createAnnouncement = (courseid, title, content, next)=> {
    db.insertAnnouncement({
        title: title,
        content: content
    }).then(result => {
        return db.bindAnnouncementCourse(courseid, result)
    }).then(() => {
        return getAnnouncements(courseid, next);
    })
}

const getPeople = (courseid, next) => {
    db.getPeopleByCourseID(courseid)
    .then(result => {
        console.log('Course people list result: ', result.people);
        return next(null, {
            status: 200,
            data: result.people
        });
    })
}

const removePeople = (courseid, userid, next) => {
    db.removeFromCourseByID(courseid)
    .then(course => {
        db.unbindUserCourse(userid, course)
        .then(() => {
            db.getPeopleByCourseID(courseid)
            .then(result => {
                console.log('Course people list result: ', result.people)
                return next(null, {
                    status: 200,
                    data: result.people
                });
            })
        })
    })
}

const getFilesList = (courseid, next) => {
    db.getFilesByCourseID(courseid)
    .then(result => {
        console.log('Course files list result: ', result)
        return next(null, {
            status: 200,
            data: result.files
        });
    })
}

const gradeSubmission = ({grades, userid, assignmentid, submissionid}, next) => {
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
                next(null, {
                    status: 200,
                    data: submissions
                });
            })
        })
    })
}

const getAssignments = (courseid, next) => {
    db.getAssignmentsByCourseID(courseid)
    .then(result => {
        console.log('getAssignmentsByCourseID result is: ', result);
        let assignments = result.toObject().assignments.map(assignment => {
            assignment.id = assignment.assignment_id;
            ['_id', '__v', 'assignment_id'].reduce((a, p) => {
                delete a[p];
                return a;
            }, assignment);
            return assignment;
        })
        console.log('Course assignments list: ', assignments);
        next(null, {
            status: 200,
            data: assignments
        });
    })
}

const createAssignment = (courseid, assignment, next) => {
    db.insertAssignment(courseid, assignment)
    .then(() => {
        return getAssignments(courseid, next);
    })
}

const getAssignmentDetail = (assignmentid, next) => {
    db.getAssignmentByID(assignmentid)
    .then(assignment => {
        console.log('Assignment detail result: ', assignment)
        next(null, {
            status: 200,
            data: assignment
        });
    })
}

const getAssignmentSubmissions = (userid, assignmentid, next) => {
    db.getSubmissons(userid, assignmentid)
    .then(result => {
        console.log('Assignment submissions result: ', result)
        next(null, {
            status: 200,
            data: result
        });
    })
}

const getAssignmentAllSubmissions = (assignmentid, next) => {
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
            next(null, {
                status: 200,
                data: submissions
            });
        })
    })
}

const getQuizzes = (courseid, next) => {
    db.getQuizzesByCoureseID(courseid)
    .then(result => {
        console.log('Course quizzes result: ', result)
        next(null, {
            status: 200,
            data: result.quizzes
        });
    })
} 

const createQuiz = (courseid, quiz, next) => {
    db.createQuiz(courseid, quiz)
    .then(() => {
        next(null, {
            status: 200,
            data: {}
        });
    });
}

const getCourseGrades = (courseid, userid, next) => {
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
            next(null, {
                status: 200,
                data: grades.concat(grades2)
            });
        })
       //res.status(200).json([]);
    })
}

const dispatch = (message, next) => {
    switch (message.cmd) {
        case 'SEARCH_COURSE':
            searchCourse(message.query,message.userid, next);
            break;
        case 'ENROLL_COURSE':
            enrollCourse(message.userid, message.courseid, message.permissionCode, next);
            break;
        case 'ENROLL_COURSE':
            waitCourse(message.userid, message.courseid, next);
            break;
        case 'DROP_COURSE':
            dropCourse(message.userid, message.courseid, next);
            break;
        case 'CREATE_COURSE':
            createCourse(message.userid, message.course, next);
            break;
        case 'GET_ANNOUNCEMENT':
            getAnnouncements(message.courseid, next);
            break;
        case 'CREATE_ANNOUNCEMENT':
            createAnnouncement(message.courseid, message.title, message.content, next);
            break;
        case 'GET_PEOPLE':
            getPeople(message.courseid, next);
            break;
        case 'REMOVE_PEOPLE':
            removePeople(message.courseid, message.userid, next);
            break;
        case 'GET_FILELIST':
            getFilesList(message.courseid, next);
            break;
        case 'GRADE_SUBMISSION':
            gradeSubmission(message.grade, next);
            break;
        case 'GET_ASSIGNMENT':
            getAssignments(message.courseid, next);
            break;
        case 'CREATE_ASSIGNMENT':
            createAssignment(message.courseid, message.assignment, next);
            break;
        case 'GET_ASSIGNMENT_DETAIL':
            getAssignmentDetail(message.assignmentid, next);
            break;
        case 'GET_ASSIGNMENT_SUBMISSION':
            getAssignmentSubmissions(message.userid, message.assignmentid, next);
            break;
        case 'GET_ASSIGNMENT_ALL_SUBMISSION':
            getAssignmentAllSubmissions(message.assignmentid, next);
            break;
        case 'GET_COURSE_GRADE':
            getCourseGrades(message.courseid, message.userid, next);
            break;
        case 'GET_QUIZ':
            getQuizzes(message.courseid, next);
            break;
        case 'CREATE_QUIZ':
            createQuiz(message.courseid, message.quiz, next);
            break;
        default:
            console.log('unknown request');
    }
}

module.exports = {dispatch}