var db = require('../lib/mongoDB')

const upvote = (req, res) => {
    db.upvoteAnswer(req.body.answer_id).then(() =>{
        console.log("Upvote answer ", req.body.answer_id)
        res.status(200).json({
            success: "Upvote answer "+ req.body.answer_id
        })
    })
}

const downvote = (req, res) => {
    db.downvoteAnswer(req.body.answer_id).then(() =>{
        console.log("Downvote answer ", req.body.answer_id)
        res.status(200).json({
            success: "Downvote answer "+ req.body.answer_id
        })
    })
}

const allVotes = (req, res) => {
    db.getVotes(req.params.answer_id).then(result =>{
        console.log("Upvotes: ", result.upvote)
        console.log("Downvotes: ", result.downvote)
        res.status(200).json({
            allVotes: result
        })
    })
}

const allComments = (req, res) => {
    db.getComments(req.params.answer_id).then(result =>{
        console.log("allComments: ", result.comments)
        res.status(200).json({
            success: result.comments
        })
    })
}

const makeComment = (req, res) => {
    console.log("Answer ID: ", req.params.answer_id)
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    newComment = {
        owner : req.body.user_id,
        time: month + '/' + date + '/' + year + ' ' + hours + ':' + min + ':' + sec,
        comment : req.body.comment
    }
    db.createComment(req.params.answer_id, newComment).then(() =>{
        res.status(200).json({
            success: 'Comment created'
        })
    })
}

const makeAnswer = (req, res) => {
    console.log("question ID: ", req.params.question)
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    newAnswer ={
        question_id: req.params.question_id,
        owner: req.body.user_id,
        time: month + '/' + date + '/' + year + ' ' + hours + ':' + min + ':' + sec,
        content: req.body.answer,
        upvote: 0,
        downvote: 0,
        bookmark: [],
        comments: [],
    }
    db.createAnswer(newAnswer).then(() =>{
        res.status(200).json({
            success: 'Answer created'
        })
    })
}

const updateAnswer = (req, res) => {
    console.log("question ID: ", req.params.question)
    console.log("Comment: ", req.body.comment)
    editInfo ={
        question_id: req.params.question_id,
        answer_id: req.params.answer_id,
        owner: req.body.user_id,
        content: req.body.answer,
    }
    db.updateOneAnswer(editInfo).then(() =>{
        res.status(200).json({
            success: 'Answer Edited'
        })
    })
}

const createBookmark = (req, res) => {
    console.log("Bookmark added")
    db.setBookmark(req.body.user_id, req.body.answer_id).then(() =>{
        res.status(200).json({
            success: 'Bookmark added'
        })
    })
}

const getOneAnswer = (req, res) => {
    db.findOneAnswer(req.params.answer_id).then(result =>{
        console.log("Answer content: ", result)
        res.status(200).json({
            answerContent: result
        })
    })
}

module.exports = {upvote, downvote, allVotes, allComments, makeComment, createBookmark,
    getOneAnswer, makeAnswer, updateAnswer}