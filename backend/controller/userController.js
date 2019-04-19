var db = require('../lib/mysql')
var bcrypt = require('bcrypt')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path')

const creatUser = (req, res) => {
    console.log('Signup request')
    let {name, email, password, role} = req.body
    db.findUserByEmail(email)
    .then(result => {
       console.log(result)
        if (result !== undefined && result.length > 0) {
            res.status(400).json({
                error: 'User exists'
            })
        } else {
            let hashed = bcrypt.hashSync(password, 10)
            console.log("hashed password: " + hashed)
            db.inserUser([name, email, hashed, role])
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
            res.status(200).json({
                id: result[0]['id'],
                name: result[0]['name'],
                email: result[0]['email'],
                avatar: result[0]['avatar'],
                phone: result[0]['phone'],
                about: result[0]['about'],
                city: result[0]['city'],
                country: result[0]['country'],
                company: result[0]['company'],
                school: result[0]['school'],
                hometown: result[0]['hometown'],
                languages: result[0]['languages'],
                gender: result[0]['gender'],
                role: result[0]['role']
            })
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
                console.log('query avatar path result: ', result[0].avatar)
                if (result[0].avatar !== null && result[0].avatar !== '') {
                    user.avatar = result[0].avatar
                } else {
                    user.avatar = user.id + '__' + files.avatar.name
                }
                absPath = path.join(__dirname, '../public/images', user.avatar)
                console.log('abs path is: ', absPath)
                fs.rename(files.avatar.path, absPath, err => {
                    if (err)
                        console.log(err)
                })
                console.log('user object: ', user)
                db.updateUser([user.avatar, user.phone, user.about, user.city, 
                user.country, user.company, user.school, user.hometown, user.languages, user.gender, user.id])
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
        let absPath = path.join(__dirname, '../public/images/defaultphoto.png')
        if (result[0].avatar !== null && result[0].avatar !== '') {
            absPath = path.join(__dirname, '../public/images', result[0].avatar)
        }
        console.log('avatar file path: ', absPath)
        res.status(200).sendFile(absPath)
    })
}

const getUserCourses = (req, res) => {
    console.log('Get user course from user id: ', req.params.userID)
    db.findCoursesByUserID(req.params.userID)
    .then(result => {
        console.log('courses reuslt: ', result)
        res.status(200).json(result)
    })
}

const getUserMessages = (req, res) => {
    console.log('Get user messages from user id: ', req.params.userID)
    res.status(200).json([])
}

const createUserMessage = (req, res) => {
    console.log('Create user messages message is: ', req.body)
    console.log('Create user messages from user id: ', req.params.userID)
    res.status(200).json({})
}

const readMessage = (req, res) => {
    console.log('User reads a message, id is: ', req.body.messageid)
    res.status(200).json({})
}

module.exports = {creatUser, getUser, updateUser, getPhoto, getUserCourses, getUserMessages ,createUserMessage, readMessage}