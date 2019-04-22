var db = require('../lib/mongoDB')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path')

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


module.exports = {updateUser, getPhoto}