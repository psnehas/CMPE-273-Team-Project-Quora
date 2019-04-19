var db = require('../lib/mongoDB')
var bcrypt = require('bcrypt')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path')

const creatUser = (req, res) => {
    console.log('Signup request')
    let user = req.body
    db.findUserByEmail(user.email)
    .then(result => {
       console.log(result)
        if (result !== undefined && result.length > 0) {
            res.status(400).json({
                error: 'User exists'
            })
        } else {
            let hashed = bcrypt.hashSync(user.password, 10)
            console.log("hashed password: " + hashed)
            user.password = hashed
            db.insertUser(user)
            .then(result => {
                console.log('signup success', result)
                res.status(200).json({
                    success: 'Successfully signed up'
                })
            })
        }
    })
}

const getUser = (req, res) => {
    console.log('Get user profile of: ', req.params.userID)
    db.findUserByID(req.params.userID)
    .then(result => {
        console.log(result)
        if (result !== undefined && result.length > 0) {
            let user = ['courses', '_id', 'password', '__v'].reduce((u, p) => {
                delete u[p];
                return u;
            }, result[0].toObject());
            user.id = user.user_id;
            console.log('the user is: ', user)
            res.status(200).json(user)
        } else {
            res.status(400).json({
                error: `User doesn't exist`
            })
        }
    })
}

const updateUser = (req, res) => {
    let user = {}
    const filepath = path.join(__dirname + '/' + '../public/images')
    if (!fs.existsSync(filepath)) {
        fs.mkdirSync(filepath, {recursive: true})
    }
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.uploadDir = filepath
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            })
        }
        Object.assign(user, fields)
        user.avatar = ''
        let absPath = ''
        if (files.avatar) {
            console.log('tmp avatar path: ', files.avatar.path)
            db.findAvatarPathByID(user.id)
            .then(result => {
                console.log('query avatar path result: ', result.avatar)
                user.avatar = user.id + '__' + files.avatar.name
                absPath = path.join(__dirname, '../public/images', user.avatar)
                console.log('abs path is: ', absPath)
                fs.rename(files.avatar.path, absPath, err => {
                    if (err)
                        console.log(err)
                })
                console.log('user object: ', user)
                db.updateUser(user)
                    .then(() => {
                        res.status(200).json({
                        success: 'Update user profile successfully'
                    })
                })
            })
        }
    })   
}

const getPhoto = (req, res) => {
    console.log('Get user avatar of: ', req.params.userID)
    db.findAvatarPathByID(req.params.userID)
    .then(result => {
        console.log('query avatar path result: ', result)
        let absPath = path.join(__dirname, '../public/images', result.avatar)
        console.log('avatar file path: ', absPath)
        res.status(200).sendFile(absPath)
    })
}

const getUserCourses = (req, res) => {
    console.log('Get user course from user id: ', req.params.userID)
    db.findCoursesByUserID(req.params.userID)
    .then(result => {
        let courses = result.toObject().courses.map(course => 
            ['announcements', 'assignments', 'quizzes', 'people', 'files', '_id', '__v'].reduce((course, p)=> {
                delete course[p];
                return course;
            }, course)
        );
        console.log('courses reuslt: ', courses);
        res.status(200).json(courses);
    })
}

const getUserMessages = (req, res) => {
    console.log('Get user messages from user id: ', req.params.userID)
    db.getMessagesByUserID(req.params.userID)
    .then(result => {
        console.log('Get user messages query result: ', result);
        res.status(200).json(result.messages);
    })
}

const createUserMessage = (req, res) => {
    console.log('Create user messages message is: ', req.body)
    console.log('Create user messages from user id: ', req.params.userID)
    const {subject, content} = req.body;
    db.findUserByEmail(req.body.to)
    .then(to => {
        let touser = to[0].toObject();
        db.findUserByID(req.params.userID)
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
                    getUserMessages(req, res);
                })
            })
        })
    })
}

const readMessage = (req, res) => {
    console.log('User reads a message, id is: ', req.body.messageid)
    db.readMessage(req.body.messageid)
    .then(() => {
        res.status(200).json({});
    })
}

module.exports = {creatUser, getUser, updateUser, getPhoto, getUserCourses, getUserMessages ,createUserMessage, readMessage}