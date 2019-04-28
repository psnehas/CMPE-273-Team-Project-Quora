var db = require('../lib/mongoDB')
var formidable = require('formidable')
var fs = require('fs')
var path = require('path')

const upvote = (req, next) => {
    db.upvoteAnswer(req.body.answer_id).then(result =>{
        console.log("Upvote answer ", req.body.answer_id)
        next(null, {
            status: 200,
            data: result.messages
        })
    })
}

const downvote = (req, next) => {
    db.downvoteAnswer(req.body.answer_id).then(result =>{
        console.log("Downvote answer ", req.body.answer_id)
        next(null, {
            status: 200,
            data: result.messages
        })
    })
}

const allVotes = (req, next) => {
    db.getVotes(req.params.answer_id).then(result =>{
        console.log("Upvotes: ", result.upvote)
        console.log("Downvotes: ", result.downvote)
        next(null, {
            status: 200,
            data: result.messages
        })
    })
}

const allComments = (req, next) => {
    db.getComments(req.params.answer_id).then(result =>{
        console.log("allComments: ", result.comments)
        next(null, {
            status: 200,
            data: result.messages
        })
    })
}

const makeComment = (req, next) => {
    console.log("Answer ID: ", req.body.answer_id)
    console.log("Comment: ", req.body.comment)
    db.createComment(req.body.answer_id, req.body.comment).then(() =>{
        next(null, {
            status: 200,
            data: result.messages
        })
    })
}

const makeAnswer = (req, next) => {
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
        next(null, {
            status: 200,
            data: result.messages
        })
    })
}

const updateAnswer = (req, next) => {
    console.log("question ID: ", req.params.question)
    console.log("Comment: ", req.body.comment)
    editInfo ={
        question_id: req.params.question_id,
        answer_id: req.params.answer_id,
        owner: req.body.user_id,
        content: req.body.answer,
    }
    db.updateOneAnswer(editInfo).then(() =>{
        next(null, {
            status: 200,
            data: result.messages
        })
    })
}

const createBookmark = (req, next) => {
    console.log("Bookmark added")
    db.setBookmark(req.body.user_id, req.body.answer_id).then(() =>{
        next(null, {
            status: 200,
            data: result.messages
        })
    })
}

const getOneAnswer = (req, next) => {
    db.findOneAnswer(req.params.answer_id).then(result =>{
        console.log("Answer content: ", result)
        next(null, {
            status: 200,
            data: result.messages
        })
    })
}

const dispatch = (message, next) => {
    switch (message.cmd) {
        case 'UPVOTE':
            upvote(message.req, next);
            break;
        case 'DOWNVOTE':
            downvote(message.req, next);
            break;
        case 'ALLVOTES':
            allVotes(message.req, next);
            break;
        case 'ALLCOMMENTS':
            allComments(message.req, next);
            break;
        case 'MAKECOMMENT':
            makeComment(message.req, next);
            break;
        case 'MAKEANSWER':
            makeAnswer(message.req, next);
            break;
        case 'UPDATEANSWER':
            updateAnswer(message.req, next);
            break;
        case 'CREATEBOOKMARK':
            createBookmark(message.req, next);
            break;
        case 'GETONEANSWER':
            getOneAnswer(message.req, next);
            break;
        default:
            console.log('unknown request');
    }
}

module.exports = {dispatch}