var db = require('../../../backend/lib/mongoDB')

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
    db.setBookmark(req.userAnswer.user_id, req.userAnswer.answer_id).then(result =>{
        next(null, {
            status: 200,
            data: result
        })
    })
    console.log("Bookmark added")
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