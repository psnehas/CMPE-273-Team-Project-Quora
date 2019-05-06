const ClientConnection = require('../client');
let client = new ClientConnection('question','response_question');
client.init();

const insertQuestion = (req, res) => {
    console.log('insertQuestion request with body: ', req.body)
    let message = {
        cmd: 'INSERT_QUESTION',
        user_id: req.user.user_id,
        question: req.body
    }
    client.send(message, function(err, result) {
        if(err){
            console.log("error at kafka question controller",err);
        }
        console.log('the result for insertquestion request is: ', result);
        res.status(result.status).json(result.data);
    })
}

const fetchQuestion = (req,res) => {
    console.log('Fetch question request, question', req.params)
    let message = {
        cmd: 'FETCH_QUESTION',
        questionid: req.params
    }
    client.send(message, function(err, result) {
        if(err){
            console.log("error at kafka question controller",err);
        }
        console.log('the result for fetch question request is: ', result);
        res.status(result.status).json(result.data);
    })
}

module.exports = {insertQuestion, fetchQuestion};