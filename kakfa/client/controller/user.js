const ClientConnection = require('../client')

let client = new ClientConnection('user', 'response_user');
client.init();

const signin = (req, res) => {
    console.log('Signin request')
    let message = {
        cmd: 'SIGN_IN',
        user: req.body
    }
    client.send(message, function(err, result) {
        console.log('the result for signin is: ', result);
        res.status(result.status).json(result.data);
    })
}

const signup = (req, res) => {
    console.log('Signup request')
    let message = {
        cmd: 'SIGN_UP',
        user: req.body
    }
    client.send(message, function(err, result) {
        console.log('the result for signup is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getUser = (req, res) => {
    console.log('Get user profile of: ', req.params.userID)
    let message = {
        cmd: 'GET_USER',
        userid: req.params.userID
    }
    client.send(message, function(err, result) {
        console.log('the result for getUser is: ', result);
        res.status(result.status).json(result.data);
    })
}

const updateUserInfo = (req, res) => {
    console.log('Update user profile of: ', req.user.user_id)
    let message = {
        cmd: 'UPDATE_USER_INFO',
        userid: req.user.user_id,
        user_info: req.body
    }
    client.send(message, function(err, result) {
        console.log('the result for update user info is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getUserFeed = (req, res) => {
    console.log('Get user feed from user id: ', req.user.user_id)
    let message = {
        cmd: 'GET_FEED',
        userid: req.user.user_id
    }
    client.send(message, function(err, result) {
        console.log('the result for getUserCourses is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getUserTopics = (req, res) => {
    console.log('Get user topics  user id: ', req.user.user_id)
    let message = {
        cmd: 'GET_USER_TOPICS',
        userid: req.user.user_id
    }
    client.send(message, function(err, result) {
        console.log('the result for getUserTopics is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getTopics = (req, res) => {
    console.log('Get all topics: ', req.user.user_id)
    let message = {
        cmd: 'GET_TOPICS',
    }
    client.send(message, function(err, result) {
        console.log('the result for get all topics is: ', result);
        res.status(result.status).json(result.data);
    })
}

const followTopics = (req, res) => {
    console.log('User follow topics  with action: ', req.body.follow)
    let message = {
        cmd: 'FOLLOW_TOPICS',
        userid: req.user.user_id,
        action: req.body.action,
        topic_ids: req.body.topic_ids,
    }
    client.send(message, function(err, result) {
        console.log('the result for getUserTopics is: ', result);
        res.status(result.status).json(result.data);
    })
}

const createTopic = (req, res) => {
    console.log('Create topic with name: ', req.body.topic_name);
    let message = {
        cmd: 'CREATE_TOPIC',
        topic_name : req.body.topic_name
    }
    client.send(message, function(err, result) {
        console.log('the result for createTopics is: ', result);
        res.status(result.status).json(result.data);
    })
}

module.exports = {signin, signup, getUserFeed, getUserTopics, getTopics, followTopics, createTopic, 
    getUser, updateUserInfo}