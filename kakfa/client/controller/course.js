const ClientConnection = require('../client')

let client = new ClientConnection('course', 'response_course');
client.init();

const searchCourse = (req, res) => {
    console.log('Course search request with body: ', req.body);
    let {userid, term, name, courseid, op, offset} = req.body;
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
    let message = {
        cmd: 'SEARCH_COURSE',
        query,
        userid
    }
    client.send(message, function(err, result) {
        console.log('the result for searchCourse is: ', result);
        const sorted = result.data.sort((a, b) => {
            return Number(a.course_id) - Number(b.course_id);
        })
        res.status(result.status).json({courses: sorted.slice(offset, offset + 5), total: result.data.length});
    })
}

const enrollCourse = (req, res) => {
    console.log('Course enroll request')
    let {userid, courseid, permissionCode} = req.body
    let message = {
        cmd: 'ENROLL_COURSE',
        userid,
        courseid,
        permissionCode
    }
    client.send(message, function(err, result) {
        console.log('the result for enrollCourse is: ', result);
        res.status(result.status).json(result.data);
    })
}

const dropCourse = (req, res) => {
    console.log('Course drop request')
    let {userid, courseid} = req.body
    let message = {
        cmd: 'DROP_COURSE',
        userid,
        courseid,
    }
    client.send(message, function(err, result) {
        console.log('the result for dropCourse is: ', result);
        res.status(result.status).json(result.data);
    })
}

const waitCourse = (req, res) => {
    console.log('Course wait request')
    let {userid, courseid} = req.body
    let message = {
        cmd: 'ENROLL_COURSE',
        userid,
        courseid,
    }
    client.send(message, function(err, result) {
        console.log('the result for waitCourse is: ', result);
        res.status(result.status).json(result.data);
    })
}

const createCourse = (req, res) => {
    let {userid, course} = req.body
    console.log('Course create request, course is: ', course)
    let message = {
        cmd: 'CREATE_COURSE',
        userid,
        course,
    }
    client.send(message, function(err, result) {
        console.log('the result for waitCourse is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getAnnouncements = (req, res) => {
    let {courseid} = req.params
    console.log('in getAnnouncements courseid type is: ', typeof courseid);
    console.log('Course announcements list request with course_id: ', courseid);
    let message = {
        cmd: 'GET_ANNOUNCEMENT',
        courseid,
    }
    client.send(message, function(err, result) {
        console.log('the result for getAnnouncements is: ', result);
        res.status(result.status).json(result.data);
    })
}

const createAnnouncement = (req, res) => {
    console.log('Course create announcement request')
    let {courseid} = req.params, {title, content} = req.body
    let message = {
        cmd: 'CREATE_ANNOUNCEMENT',
        courseid,
        title,
        content
    }
    client.send(message, function(err, result) {
        console.log('the result for createAnnouncement is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getPeople = (req, res) => {
    let {courseid} = req.params, {offset} = req.query
    console.log('Course people list request for course: ', courseid)
    let message = {
        cmd: 'GET_PEOPLE',
        courseid,
    }
    client.send(message, function(err, result) {
        console.log('the result for getPeople is: ', result);
        res.status(result.status).json({people: result.data.slice(offset, offset + 5), total: result.data.length});
    })
}

const removePeople = (req, res) => {
    let {courseid} = req.params, {userid} = req.query
    console.log('remove people request: ', courseid, userid)
    let message = {
        cmd: 'REMOVE_PEOPLE',
        courseid,
        userid,
    }
    client.send(message, function(err, result) {
        console.log('the result for removePeople is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getFilesList = (req, res) => {
    let {courseid} = req.params
    console.log('Course files list request for course: ', courseid)
    let message = {
        cmd: 'GET_FILELIST',
        courseid,
    }
    client.send(message, function(err, result) {
        console.log('the result for getFilesList is: ', result);
        res.status(result.status).json(result.data);
    })
}

const gradeSubmission = (req, res) => {
    let {userid, assignmentid} = req.query, {submissionid, grades} = req.body
    console.log('grade submission request, userid, assignmentid, submissionid, grades: ', userid, assignmentid, submissionid,grades)
    let message = {
        cmd: 'GRADE_SUBMISSION',
        grade: {
            grades,
            userid,
            assignmentid,
            submissionid
        }
    }
    client.send(message, function(err, result) {
        console.log('the result for getFilesList is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getAssignments = (req, res) => {
    let {courseid} = req.params
    console.log('in getAssignments courseid type is: ', typeof courseid);
    let message = {
        cmd: 'GET_ASSIGNMENT',
        courseid,
    }
    client.send(message, function(err, result) {
        console.log('the result for getAssignments is: ', result);
        res.status(result.status).json(result.data);
    })
}

const createAssignment = (req, res) => {
    let {courseid} = req.params;
    let {title, due, points, content} = req.body;
    let message = {
        cmd: 'CREATE_ASSIGNMENT',
        courseid,
        assignment: {
            title,
            due,
            points,
            content
        }
    }
    client.send(message, function(err, result) {
        console.log('the result for createAssignment is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getAssignmentDetail = (req, res) => {
    let {assignmentid} = req.params
    console.log('Assignment detail request: ', assignmentid)
    let message = {
        cmd: 'GET_ASSIGNMENT_DETAIL',
        assignmentid
    }
    client.send(message, function(err, result) {
        console.log('the result for getAssignmentDetail is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getAssignmentSubmissions = (req, res) => {
    let {assignmentid} = req.params
    let userid = req.query.userid
    console.log('Assignment submissions request: ', userid, assignmentid)
    let message = {
        cmd: 'GET_ASSIGNMENT_SUBMISSION',
        assignmentid,
        userid
    }
    client.send(message, function(err, result) {
        console.log('the result for getAssignmentSubmissions is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getAssignmentAllSubmissions = (req, res) => {
    let {assignmentid} = req.params
    console.log('Assignment all submissions request, assignmentid is:', assignmentid)
    let message = {
        cmd: 'GET_ASSIGNMENT_ALL_SUBMISSION',
        assignmentid
    }
    client.send(message, function(err, result) {
        console.log('the result for getAssignmentAllSubmissions is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getQuizzes = (req, res) => {
    let {courseid} = req.params
    console.log('Course quizzes request: ', courseid)
    let message = {
        cmd: 'GET_QUIZ',
        assignmentid
    }
    client.send(message, function(err, result) {
        console.log('the result for getQuizzes is: ', result);
        res.status(result.status).json(result.data);
    })
}

const createQuiz = (req, res) => {
    let {courseid} = req.params, {title, description, available, until, due, duration, points, questions} = req.body
    let message = {
        cmd: 'CREATE_QUIZ',
        quiz: {title, description, available, until, due, duration, points, questions}
    }
    client.send(message, function(err, result) {
        console.log('the result for createQuiz is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getCourseGrades = (req, res) => {
    let {courseid} = req.params, {userid} = req.query
    let message = {
        cmd: 'GET_COURSE_GRADE',
        courseid,
        userid
    }
    client.send(message, function(err, result) {
        console.log('the result for getCourseGrades is: ', result);
        res.status(result.status).json(result.data);
    })
}

module.exports = {
        searchCourse, enrollCourse, waitCourse, createCourse, dropCourse,
        getAnnouncements, createAnnouncement,
        getPeople, removePeople,
        getFilesList,
        getAssignments, createAssignment, getAssignmentDetail, getAssignmentSubmissions, getAssignmentAllSubmissions,
        gradeSubmission,
        getQuizzes, createQuiz,
        getCourseGrades
    }