var db = require('../../../backend/lib/mongoDB')


const insertQuestion = (user_id, question, next) => {
    let topics = question.topics.map(topic => topic._id);
    let que = {
        topics,
        user_id,
        content: question.content
    };
    db.insertQuestion(que).then(result =>{
        console.log("insert question result: ", result);
        db.bindUserQuestion(user_id, result._id)
        .then(res => {
            console.log("bind user question result: ", res);
            let promises = topics.map(topic_id => {
                return db.bindTopicQuestion(topic_id, result._id);
            });
            Promise.all(promises)
            .then(res => {
                next(null, {
                    status: 200,
                    data: {success: true}
                });
            });
        });
    });
}

const fetchQuestion = (req, next) => {
    console.log("req",req.questionid.question_id)
    db.fetchQuestion(req.questionid.question_id)
    .then(result => {
        console.log("Fetch question result: ", result);
        next(null, {
            status: 200,
            data: result
        });
    });
}

const dispatch = (message, next) => {
    switch (message.cmd) {
        case 'INSERT_QUESTION':
            insertQuestion(message.user_id, message.question, next);
            break;
        case 'FETCH_QUESTION':
            fetchQuestion(message, next);
            break;
        default: console.log('unknown request');
    }
}

module.exports={dispatch};