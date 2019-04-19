var mysql = require('mysql')

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'lab1_canvas',
    database: 'canvas',
    port: '3306',
    timezone: 'utc'
})

const _query = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err)
            } else {
                conn.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    conn.release()
                })
            }
        })
    })
}

const userTable =
    `create table if not exists users(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        password VARCHAR(100) NOT NULL,
        avatar VARCHAR(256),
        phone VARCHAR(32),
        about VARCHAR(256),
        city VARCHAR(32),
        country VARCHAR(32),
        company VARCHAR(32),
        school VARCHAR(32),
        hometown VARCHAR(32),
        languages VARCHAR(32),
        gender VARCHAR(32),
        role VARCHAR(32),
        PRIMARY KEY ( id )
    )`

const courseTable = 
    `create table if not exists courses(
        id INT NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        dept VARCHAR(32) NOT NULL,
        description VARCHAR(1024),
        room VARCHAR(32) NOT NULL,
        capacity INT NOT NULL,
        waitlistCapacity INT NOT NULL,
        term VARCHAR(32) NOT NULL,
        occupied INT NOT NULL,
        waiting INT NOT NULL,
        instructor VARCHAR(32) NOT NULL,
        needCode VARCHAR(8) NOT NULL,
        PRIMARY KEY ( id )
    )`

const user_course = 
    `create table if not exists user_course(
        id INT NOT NULL AUTO_INCREMENT, 
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        status VARCHAR(16) NOT NULL,
        PRIMARY KEY ( id ),
        CONSTRAINT fk_user_course_user_id FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT fk_user_course_course_id FOREIGN KEY (course_id) REFERENCES courses(id)
    )`

const permissionCode =
    `create table if not exists perm_code(
        id INT NOT NULL AUTO_INCREMENT, 
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        permission_code VARCHAR(16) NOT NULL,
        status VARCHAR(16) NOT NULL,
        PRIMARY KEY ( id ),
        CONSTRAINT fk_perm_code_user_id FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT fk_perm_code_course_id FOREIGN KEY (course_id) REFERENCES courses(id)
    )
    `

const announcements = 
    `create table if not exists announcements(
        id INT NOT NULL AUTO_INCREMENT,
        course_id INT NOT NULL,
        title VARCHAR(64),
        content VARCHAR(1024),
        dt DATETIME,
        PRIMARY KEY ( id ),
        CONSTRAINT fk_announcements_course_id FOREIGN KEY (course_id) REFERENCES courses(id)
    )
    `
const files =
    `create table if not exists files(
        course_id INT NOT NULL,
        filename VARCHAR(256),
        size VARCHAR(16),
        createdate DATE,
        PRIMARY KEY ( course_id ),
        CONSTRAINT fk_files_course_id FOREIGN KEY (course_id) REFERENCES courses(id)
    )
    `

const assignments =
    `create table if not exists assignments(
        id INT NOT NULL AUTO_INCREMENT,
        course_id INT NOT NULL,
        title VARCHAR(64) NOT NULL,
        content VARCHAR(1024),
        due DATETIME,
        points INT,
        status VARCHAR(8),
        PRIMARY KEY ( id ),
        CONSTRAINT fk_assignments_course_id_idx FOREIGN KEY (course_id) REFERENCES courses(id)
    )
    `

const submissions =
    `create table if not exists submissions(
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        assignment_id INT NOT NULL,
        filename VARCHAR(256),
        submitdt DATETIME,
        mimetype VARCHAR(32),
        grades INT,
        PRIMARY KEY ( id ),
        CONSTRAINT fk_submissions_user_id FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT fk_submissions_assignment_id FOREIGN KEY (assignment_id) REFERENCES assignments(id)
    )
    `

const quizzes =
    `create table if not exists quizzes(
        id INT NOT NULL AUTO_INCREMENT,
        course_id INT NOT NULL,
        title VARCHAR(64) NOT NULL,
        description VARCHAR(1024),
        available DATETIME,
        until DATETIME,
        duration INT,
        points INT,
        questions VARCHAR(4096),
        PRIMARY KEY ( id ),
        CONSTRAINT fk_quizzes_course_id_idx FOREIGN KEY (course_id) REFERENCES courses(id)
    )
    `

const quiz_submissions = 
    `create table if not exists quiz_submissions(
        id INT NOT NULL AUTO_INCREMENT,
        user_id INT NOT NULL,
        quiz_id INT NOT NULL,
        submitdt DATETIME,
        grades INT,
        PRIMARY KEY ( id ),
        CONSTRAINT fk_quiz_submissions_user_id FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT fk_quiz_submissions_quiz_id FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
    )
    `

const createTable = (sql) => {
    return _query(sql, [ ])
}

createTable(userTable)
createTable(courseTable)
createTable(user_course)
createTable(permissionCode)
createTable(announcements)
createTable(files)
createTable(assignments)
createTable(submissions)
createTable(quizzes)
createTable(quiz_submissions)


exports.inserUser = (value) => {
    const sql = 'insert into users set name=?, email=?, password=?, role=?;'
    return _query(sql, value)
}

exports.findUserByEmail = (email) => {
    const sql = `select * from users where email="${email}";`
    return _query(sql)
}

exports.findUserByID = (id) => {
    const sql = `select * from users where id="${id}";`
    return _query(sql)
}

exports.findAvatarPathByID = (id) => {
    const sql = `select avatar from users where id ="${id}";`
    return _query(sql)
}

exports.updateUser = (value) => {
    const sql = `update users set avatar=?, phone=?, about=?, city=?, country=?, company=?, school=?, hometown=?, languages=?, gender=? where id=?;`
    return _query(sql, value)
}

exports.insertCourse = (value) => {
    const sql = `insert into courses set id=?, name=?, dept=?, description=?, room=?, capacity=?, waitlistCapacity=?, term=?, occupied=?, waiting=?, instructor=?, needCode=?;`
    return _query(sql, value)
}

exports.findCoursesByUserID = (userID) => {
    const sql = `select courses.* from users join user_course on users.id=user_course.user_id join courses on courses.id=user_course.course_id where users.id="${userID}";`
    return _query(sql)
    
}

exports.findCourseByID = (id) => {
    const sql = `select * from courses where id="${id}";`
    return _query(sql)
}

exports.findCourseStatus = (value) => {
    const sql = `select * from user_course where user_id=? and course_id=?;`
    return _query(sql, value)
}

exports.enrollCourseByID = (id) => {
    const sql = `update courses set occupied = occupied + 1 where id="${id}";`
    return _query(sql)
}

exports.removeFromCourseByID = (id) => {
    const sql = `update courses set occupied = occupied - 1 where id="${id}";`
    return _query(sql)
}

exports.waitCourseByID = (id) => {
    const sql = `update courses set waiting = waiting + 1 where id="${id}";`
    return _query(sql)
}

exports.bindUserCourse = (value) => {
    const sql = `insert into user_course set user_id=?, course_id=?, status=?;`
    return _query(sql, value)
}

exports.unbindUserCourse = (value) => {
    const sql = `delete from user_course where user_id=? and course_id=?;`
    return _query(sql, value)
}

exports.findPermissionCode = (value) => {
    const sql = `select * from perm_code where user_id=? and course_id=?;`
    return _query(sql, value)
}

exports.createPermissionCode = (value) => {
    const sql = `insert into perm_code set user_id=?, course_id=?, status="fresh;`
    return _query(sql, value)
}

exports.destoryPermissionCode = (value) => {
    const sql = `update perm_code set status="used" where user_id=? and course_id=?;`
    return _query(sql, value)
}

exports.findAnnouncementsByCourseID = (courseid) => {
    const sql = `select * from announcements where course_id="${courseid}";`
    return _query(sql)
}

exports.insertAnnouncement = (value) => {
    const sql = `insert into announcements set course_id=?, title=?, content=?, dt=now();`
    return _query(sql, value)
}

exports.getPeopleByCourseID = (courseid) => {
    const sql = `select users.id, users.name, users.role from users join user_course on users.id=user_course.user_id where user_course.course_id="${courseid}";`
    return _query(sql)
}

exports.insertFiles = (value) => {
    const sql = `insert into files set course_id=?, filename=?, size=?, createdate=curdate();`
    return _query(sql, value)
}

exports.getFilesByCourseID = (courseid) => {
    const sql = `select filename, size, createdate from files where course_id="${courseid}";`
    return _query(sql)
}

exports.insertAssignment = (value) => {
    const sql = `insert into assignments set course_id=?, title=?, content=?, due=?, points=?, status="open";`
    return _query(sql, value)
}

exports.getAssignmentsByCourseID = (courseid) => {
    const sql = `select * from assignments where course_id="${courseid}";`
    return _query(sql)
}

exports.getAssignmentByID = (assignmentid) => {
    const sql = `select * from assignments where id="${assignmentid}";`
    return _query(sql)
}

exports.getSubmissons = (userid, assignmentid) => {
    const sql = `select filename, submitdt from submissions where user_id="${userid}" and assignment_id="${assignmentid}";`
    return _query(sql)
}

exports.getAllSubmissons = (assignmentid) => {
    const sql = `select u.id as userid, u.name as username, s.id as submissionid, s.filename, s.mimetype, s.grades, assignments.points
                from users u join submissions s on s.user_id = u.id join assignments on assignments.id ="${assignmentid}" where s.assignment_id="${assignmentid}";`
    return _query(sql)
}

exports.createSubmission = (value) => {
    const sql = `insert into submissions set user_id=?, assignment_id=?, filename=?, mimetype=?, submitdt=now();`
    return _query(sql, value)
}

exports.getQuizzesByCoureseID = (courseid) => {
    const sql = `select * from quizzes where course_id="${courseid}";`
    return _query(sql)
}

exports.createQuiz = (value) => {
    const sql = `insert into quizzes set course_id=?, title=?, description=?, available=?, until=?, duration=?, points=?, questions=?;`
    return _query(sql, value)
}

exports.updateGrades = (value) => {
    const sql = `update submissions set grades=? where id=? and user_id=? and assignment_id=?;`
    return _query(sql, value)
}

exports.getCourseAssignmentsGrades = (courseid, userid) => {
    const sql = `select a.id as assignmentid, a.title, a.due, s.grades, a.points from assignments a join submissions s on a.id = s.assignment_id 
                where a.course_id="${courseid}" and s.user_id="${userid}";`
    return _query(sql)
}

exports.getCourseQuizzesGrades = (courseid, userid) => {
    const sql = `select q.id as quizid, q.title, qs.grades, q.points from quizzes q join quiz_submissions qs on q.id = qs.quiz_id 
                where q.course_id="${courseid}" and qs.user_id="${userid}";`
    return _query(sql)
}

exports.query = (sql) => {
    return _query(sql)
}