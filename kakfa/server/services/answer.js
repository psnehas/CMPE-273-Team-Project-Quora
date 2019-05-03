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
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    newComment = {
        answer_id: req.comment.answer_id,
        owner : req.comment.owner,
        time: month + '/' + date + '/' + year + ' ' + hours + ':' + min + ':' + sec,
        comment : req.comment.comment
    }
    db.createComment(newComment).then(result =>{
        next(null, {
            status: 200,
            data: result
        })
    })
}

const makeAnswer = (req, next) => {
    console.log("question message: ", req)
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    newAnswer ={
        question_id: req.answer.question_id,
        owner: req.answer.owner,
        time: month + '/' + date + '/' + year + ' ' + hours + ':' + min + ':' + sec,
        content: req.answer.content,
        upvote: 0,
        downvote: 0,
        bookmark: [],
        comments: [],
    }
    console.log("newAnswer", newAnswer)
    db.createAnswer(newAnswer).then(result =>{
        next(null, {
            status: 200,
            data: result
        })
    })
    db.updateUserWithAnswer(req.answer.owner, newAnswer).then(result => {
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