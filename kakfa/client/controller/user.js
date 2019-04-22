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

const getUserCourses = (req, res) => {
    console.log('Get user course from user id: ', req.params.userID)
    let message = {
        cmd: 'GET_COURSE',
        userid: req.params.userID
    }
    client.send(message, function(err, result) {
        console.log('the result for getUserCourses is: ', result);
        res.status(result.status).json(result.data);
    })
}

const getUserMessages = (req, res) => {
    console.log('Get user messages from user id: ', req.params.userID)
    let message = {
        cmd: 'GET_MESSAGE',
        userid: req.params.userID
    }
    client.send(message, function(err, result) {
        console.log('the result for getUserMessages is: ', result);
        res.status(result.status).json(result.data);
    })
}

const createUserMessage = (req, res) => {
    console.log('Create user messages message is: ', req.body)
    console.log('Create user messages from user id: ', req.params.userID)
    const {subject, content, to} = req.body;
    let message = {
        cmd: 'CREATE_MESSAGE',
        message: {
            subject: subject,
            content: content,
            to_email: to,
            userid: req.params.userID
        }
    }
    client.send(message, function(err, result) {
        console.log('the result for createUserMessage is: ', result);
        res.status(result.status).json(result.data);
    })
}

const readMessage = (req, res) => {
    console.log('User reads a message, id is: ', req.body.messageid)
    let message = {
        cmd:'READ_MESSAGE',
        messageid: req.body.messageid
    }
    client.send(message, function(err, result) {
        console.log('the result for readMessage is: ', result);
        res.status(result.status).json(result.data);
    })
}

module.exports = {signin, signup, getUser, getUserCourses, getUserMessages ,createUserMessage, readMessage}