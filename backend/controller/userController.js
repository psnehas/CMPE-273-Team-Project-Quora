var db = require('../lib/mongoDB')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path')

const updateUserAvatar = (req, res) => {
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
        let absPath = ''
        if (files.avatar) {
            console.log('tmp avatar path: ', files.avatar.path)
            db.findAvatarPathByID(req.user.user_id)
            .then(result => {
                console.log('query avatar path result: ', result.avatar)
                let avatar = result.avatar;
                if (avatar === 'defaultphoto.png') {
                    avatar = req.user.user_id + '__' + files.avatar.name
                }
                absPath = path.join(__dirname, '../public/images', avatar)
                console.log('abs path is: ', absPath)
                fs.rename(files.avatar.path, absPath, err => {
                    if (err)
                        console.log(err)
                })
                db.updateUserAvatar(req.user.user_id, avatar)
                    .then(() => {
                        res.status(200).json({
                        success: 'Update user profile successfully'
                    })
                })
            })
        }
    })   
}

const getUserAvatar = (req, res) => {
    console.log('Get user avatar of: ', req.params.userID)
    db.findAvatarPathByID(req.params.userID)
    .then(result => {
        console.log('query avatar path result: ', result)
        let absPath = path.join(__dirname, '../public/images', result.avatar)
        console.log('avatar file path: ', absPath)
        res.status(200).sendFile(absPath)
    })
}


const getStats = (req, res) => {
    //console.log('get stats request from user: ', req.user.user_id);
    let data = {
        top5ViewAnswers: [],
        top5UpvotesAnswers: [],
        top5DownvotesAnswers: [],
    };
    db.findAllAnswersByView()
    .then(answers => {
        console.log('find top 5 view answers: ', answers);
        data.top5ViewAnswers = answers;
        db.findAllAnswersByUpvotes()
        .then(answers => {
            console.log('find top 5 upvote answers: ', answers);
            data.top5UpvotesAnswers = answers;
            db.findAllAnswersByDownvotes()
            .then(answers => {
                console.log('find top 5 downvote answers: ', answers);
                data.top5DownvotesAnswers = answers;
                res.status(200).json(data);
            });
        });
    });
}

module.exports = {updateUserAvatar, getUserAvatar, getStats}