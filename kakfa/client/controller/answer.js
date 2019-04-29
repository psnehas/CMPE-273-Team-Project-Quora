const ClientConnection = require('../client')

let client = new ClientConnection('answer', 'response_answer');
client.init();


const upvote = (req, res) => {
    console.log("upvote request")
    let message = {
        cmd: 'UPVOTE',
        user: req.body
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
        user: req.body
    }
    client.send(message, function(err, result) {
        console.log('the result for downvote is: ', result);
        res.status(result.status).json(result.data);
    })
}

const allVotes = (req, res) => {
    console.log("get votes request")
    let message = {
        cmd: 'ALL_VOTES',
        user: req.body
    }
    client.send(message, function(err, result) {
        console.log('the result for get votes is: ', result);
        res.status(result.status).json(result.data);
    })
}

const allComments = (req, res) => {
    console.log("get comments request")
    let message = {
        cmd: 'ALL_COMMENTS',
        user: req.body
    }
    client.send(message, function(err, result) {
        console.log('the result for get comments is: ', result);
        res.status(result.status).json(result.data);
    })
}

const makeComment = (req, res) => {
    console.log("make comment request")
    let message = {
        cmd: 'MAKE_COMMENT',
        user: req.body
    }
    client.send(message, function(err, result) {
        console.log('the result for make comment is: ', result);
        res.status(result.status).json(result.data);
    })
}

const makeAnswer = (req, res) => {
    console.log("make answer request")
    let message = {
        cmd: 'MAKE_ANSWER',
        user: req.body
    }
    client.send(message, function(err, result) {
        console.log('the result for make answer is: ', result);
        res.status(result.status).json(result.data);
    })
}

const updateAnswer = (req, res) => {
    console.log("update answer request")
    let message = {
        cmd: 'UPDATE_ANSWER',
        user: req.body
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
        user: req.body
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
        user: req.body
    }
    client.send(message, function(err, result) {
        console.log('the result for get one answer is: ', result);
        res.status(result.status).json(result.data);
    })
}

module.exports = {upvote, downvote, allVotes, allComments, makeComment, createBookmark,
    getOneAnswer, makeAnswer, updateAnswer}