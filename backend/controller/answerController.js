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
    console.log("Answer ID: ", req.body.answer_id)
    console.log("Comment: ", req.body.comment)
    db.createComment(req.body.answer_id, req.body.comment).then(() =>{
        res.status(200).json({
            success: 'Comment created'
        })
    })
}

const makeAnswer = (req, res) => {
    console.log("question ID: ", req.params.question)
    console.log("Comment: ", req.body.comment)
    newAnswer ={
        question_id: req.params.question_id,
        owner: req.body.user_id,
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