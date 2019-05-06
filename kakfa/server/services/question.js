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
        .then(result => {
            console.log("bind user question result: ", result);
            next(null, {
                status: 200,
                data: {success: true}
            });
        });
    });
}

const fetchQuestion = (req, next) => {
    db.fetchQuestion(req.questionid.question_id)
    .then(result => {
        console.log("Fetch question result: ", result);
        var questionFollwed = false;
        db.findUserFollowedQuestions(req.userid).then(result2 => {
            console.log("result2",result2)
            for(i = 0; i < result2.followed_questions.length; i++){
                if(req.userid == result2.followed_questions[i]){
                    questionFollwed = true
                }
            }
        })
        next(null, {
            status: 200,
            data: {question: result, questionFollwed: questionFollwed}
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