const ClientConnection = require('../client')

let client = new ClientConnection('answer', 'response_answer');
client.init();


const upvote = (req, res) => {
    console.log("upvote request")
    let message = {
        cmd: 'UPVOTE',
        upvote: req.params
    }
    client.send(message, function(err, result) {
        console.log('the result for upvote is: ', result);
        res.status(result.status).json(result.data);
    })
}

const downvote = (req, res) => {
    console.log("downvote request")
    let message = {
        cmd: 'DOWNVOTE',
        downvote: req.params
    }
    client.send(message, function(err, result) {
        console.log('the result for downvote is: ', result);
        res.status(result.status).json(result.data);
    })
}

const allComments = (req, res) => {
    console.log("get comments request")
    let message = {
        cmd: 'ALL_COMMENTS',
        allComments: req.params
    }
    client.send(message, function(err, result) {
        console.log('the result for get comments is: ', result);
        res.status(result.status).json(result.data);
    })
}

const makeComment = (req, res) => {
    console.log("make comment request")
    let request = {
        answer_id: req.params.answer_id,
        owner: req.user.user_id,
        comment: req.body.comment,
        anonymous: req.body.anonymous
    }
    let message = {
        cmd: 'MAKE_COMMENT',
        comment: request
    }
    client.send(message, function(err, result) {
        console.log('the result for make comment is: ', result);
        res.status(result.status).json(result.data);
    })
}

const makeAnswer = (req, res) => {
    console.log("make answer request")
    let request = {
        question_id: req.params.question_id,
        owner: req.user.user_id,
        content: req.body.content,
        anonymous: req.body.anonymous
    }
    let message = {
        cmd: 'MAKE_ANSWER',
        answer: request
    }
    client.send(message, function(err, result) {
        console.log('the result for make answer is: ', result);
        res.status(result.status).json(result.data);
    })
}

const updateAnswer = (req, res) => {
    console.log("update answer request")
    let request = {
        answer_id: req.params.answer_id,
        content: req.body.content
    }
    let message = {
        cmd: 'UPDATE_ANSWER',
        update: request
    }
    client.send(message, function(err, result) {
        console.log('the result for update answer is: ', result);
        res.status(result.status).json(result.data);
    })
}

const createBookmark = (req, res) => {
    console.log("create bookmark request")
    let message = {
        cmd: 'CREATE_BOOKMARK',
        userAnswer: req.params
    }
    client.send(message, function(err, result) {
        console.log('the result for create bookmark is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getOneAnswer = (req, res) => {
    console.log("get one answer request")
    let message = {
        cmd: 'GET_ONE_ANSWER',
        OneAnswer: req.params
    }
    client.send(message, function(err, result) {
        console.log('the result for get one answer is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getOwnerOfAnswer = (req, res) => {
    console.log("get owner of answer request")
    let message = {
        cmd: 'GET_OWNER_OF_ANSWER',
        answer: req.params
    }
    client.send(message, function(err, result) {
        console.log('the result for get one answer is: ', result);
        res.status(result.status).json(result.data);
    })
}

module.exports = {upvote, downvote, allVotes, allComments, makeComment, createBookmark,
    getOneAnswer, makeAnswer, updateAnswer, getOwnerOfAnswer}