const ClientConnection = require('../client');
let client = new ClientConnection('question','response_question');
client.init();

const insertQuestion = (req, res) => {
    console.log('insertQuestion request')
    let message = {
        cmd: 'INSERT_QUESTION',
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

module.exports = {insertQuestion};