var db = require('../../../backend/lib/mongoDB')
const insertQuestion = (req, next) => {
    db.insertQuestion(req.body).then(result =>{
        //console.log("insert question ", req.body.question_id)
        next(null, {
            status: 200,
            data: result.messages
        })
    })
}

const dispatch = (message, next) => {
    switch (message.cmd) {
        case 'INSERT_QUESTION':
            insertQuestion(message.question, next);
            break;
        default: console.log('unknown request');
    }
}

module.exports={dispatch};