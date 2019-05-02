var db = require('../../../backend/lib/mongoDB')

const upvote = (req, next) => {
    db.upvoteAnswer(req.upvote.answer_id).then(result =>{
        console.log("Upvote answer ", req.upvote.answer_id)
        next(null, {
            status: 200,
            data: result
        })
    })
}

const downvote = (req, next) => {
    db.downvoteAnswer(req.downvote.answer_id).then(result =>{
        console.log("Downvote answer ", req.downvote.answer_id)
        next(null, {
            status: 200,
            data: result
        })
    })
}

const allVotes = (req, next) => {
    db.getVotes(req.allVotes.answer_id).then(result =>{
        console.log("Upvotes: ", result.upvote)
        console.log("Downvotes: ", result.downvote)
        next(null, {
            status: 200,
            data: result
        })
    })
}

const allComments = (req, next) => {
    db.getComments(req.allComments.answer_id).then(result =>{
        console.log("allComments: ", result)
        next(null, {
            status: 200,
            data: result
        })
    })
}

const makeComment = (req, next) => {
    console.log("Answer ID: ", req.comment.answer_id)
    db.createComment(req.comment).then(result =>{
        next(null, {
            status: 200,
            data: result
        })
    })
}

const makeAnswer = (req, next) => {
    console.log("question message: ", req)
    // console.log("Comment: ", req.body.comment)
    // newAnswer ={
    //     question_id: req.params.question_id,
    //     owner: req.body.user_id,
    //     content: req.body.answer,
    //     upvote: 0,
    //     downvote: 0,
    //     bookmark: [],
    //     comments: [],
    // }
    newAnswer = req.answer
    console.log("newAnswer", newAnswer)
    db.createAnswer(newAnswer).then(result =>{
        console.log("rere",result)
        next(null, {
            status: 200,
            data: result
        })
    })
}

const updateAnswer = (req, next) => {
    console.log("question ID: ", req.update)
    editInfo ={
        answer_id: req.update.answer_id,
        content: req.update.content,
    }
    db.updateOneAnswer(editInfo).then(result =>{
        next(null, {
            status: 200,
            data: result
        })
    })
}

const createBookmark = (req, next) => {
    db.setBookmark(req.userAnswer.user_id, req.userAnswer.answer_id).then(result =>{
        next(null, {
            status: 200,
            data: result
        })
    })
    console.log("Bookmark added")
}

const getOneAnswer = (req, next) => {
    db.findOneAnswer(req.OneAnswer.answer_id).then(result =>{
        console.log("Answer content: ", result)
        next(null, {
            status: 200,
            data: result
        })
    })
}

const dispatch = (message, next) => {
    switch (message.cmd) {
        case 'UPVOTE':
            upvote(message, next);
            break;
        case 'DOWNVOTE':
            downvote(message, next);
            break;
        case 'ALL_VOTES':
            allVotes(message, next);
            break;
        case 'ALL_COMMENTS':
            allComments(message, next);
            break;
        case 'MAKE_COMMENT':
            makeComment(message, next);
            break;
        case 'MAKE_ANSWER':
            makeAnswer(message, next);
            break;
        case 'UPDATE_ANSWER':
            updateAnswer(message, next);
            break;
        case 'CREATE_BOOKMARK':
            createBookmark(message, next);
            break;
        case 'GET_ONE_ANSWER':
            getOneAnswer(message, next);
            break;
        default:
            console.log('unknown request');
    }
}

module.exports = {dispatch}