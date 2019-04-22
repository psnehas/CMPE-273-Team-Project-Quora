var db = require('../../../Backend/lib/mongoDB')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')


const signin = (user, next) => {
    console.log('Signin request')
    let {email, password} = user;
    db.findUserByEmail(email)
    .then(result => {
        console.log(result)
        let res = {};
        if (!result) {
            res.status = 400;
            res.data = {error: 'User doesn\'t exists'};
        } else {
            if (!bcrypt.compareSync(password, result.password)){
                console.log("Signin failed, wrong password")
                res.status = 400;
                res.data = {error: 'Invalid password'};
            } else {
                const token = jwt.sign({ email: result.email }, 'quora_secret_key')
                res.status = 200;
                res.data = {
                    token,
                    userid: result.user_id,
                }
            }
        }
        next(null, res);
    })
}

const signup = (user, next) => {
    console.log('create a user: ', user);
    db.findUserByEmail(user.email)
    .then(result => {
       console.log(result)
       let res = {};
        if (result) {
            res.status = 400;
            res.data = {error: 'User exists'};
            next(null, res);
        } else {
            let hashed = bcrypt.hashSync(user.password, 10)
            console.log("hashed password: " + hashed)
            user.password = hashed
            db.insertUser(user)
            .then(result => {
                console.log('signup success', result)
                res.status = 200;
                res.data = {success: 'Successfully signed up'};
                next(null, res);
            })
        }
    })
}

const getUser = (userid, next) => {
    db.findUserByID(userid)
    .then(result => {
        console.log(result)
        let res = {};
        if (result !== undefined && result.length > 0) {
            let user = ['courses', '_id', 'password', '__v'].reduce((u, p) => {
                delete u[p];
                return u;
            }, result[0].toObject());
            user.id = user.user_id;
            console.log('the user is: ', user)
            res.status = 200;
            res.data = user;
        } else {
            res.status = 400;
            res.data = {error: `User doesn't exist`};
        }
        next(null, res);
    })
}

const getUserCourses = (userid, next) => {
    db.findCoursesByUserID(userid)
        .then(result => {
            let courses = result.toObject().courses.map(course => 
                ['announcements', 'assignments', 'quizzes', 'people', 'files', '_id', '__v'].reduce((course, p)=> {
                    delete course[p];
                    return course;
                }, course)
            );
            console.log('courses reuslt: ', courses);
            next(null, {
                status: 200,
                data: courses
            })
        })
}

const getUserMessages = (userid, next) => {
    db.getMessagesByUserID(userid)
    .then(result => {
        console.log('Get user messages query result: ', result);
        next(null, {
            status: 200,
            data: result.messages
        })
    })
}

const createUserMessage = (message, next) => {
    const {subject, content, to_email, userid} = message;
    db.findUserByEmail(to_email)
    .then(to => {
        let touser = to.toObject();
        db.findUserByID(userid)
        .then(from => {
            let fromuser = from[0].toObject();
            let message = {
                from_user_id: fromuser.user_id,
                from_name: fromuser.name,
                from_email: fromuser.email,
                to_user_id: touser.user_id,
                to_name: touser.name,
                to_email: touser.email,
                subject,
                content,
            }
            db.insertMessage(touser.user_id, message)
            .then(() => {
                message.status = 'readed';
                db.insertMessage(fromuser.user_id, message)
                .then(() => {
                    getUserMessages(userid, next);
                })
            })
        })
    })
}

const readMessage = (messageid, next) => {
    db.readMessage(messageid)
    .then(() => {
        next(null, {
            status: 200,
            data: {}
        })
    })
}

const dispatch = (message, next) => {
    switch (message.cmd) {
        case 'SIGN_IN':
            signin(message.user, next);
            break;
        case 'SIGN_UP':
            signup(message.user, next);
            break;
        case 'GET_USER':
            getUser(message.userid, next);
            break;
        case 'GET_COURSE':
            getUserCourses(message.userid, next);
            break;
        case 'GET_MESSAGE':
            getUserMessages(message.userid, next);
            break;
        case 'CREATE_MESSAGE':
            createUserMessage(message.message, next);
            break;
        case 'READ_MESSAGE':
            readMessage(message.messageid, next);
            break;
        default:
            console.log('unknown request');
    }
}

module.exports = {dispatch}