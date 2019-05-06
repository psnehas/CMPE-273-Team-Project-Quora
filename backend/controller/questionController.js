var db=require("../lib/mongoDB");

const addQuestion =(req,res)=>{
    var {question_text} = req.body;//only for console purpose
        console.log("Insert question", question_text);
        newQuestion ={
            createdBy: req.body.user_id,
            question_text: req.body.question_text,
            display_name:req.body.display_name,
            questionTopics:req.body.questionTopics,
            dateCreated:new Date()
        }
        db.insertQuestion(newQuestion).then((response) =>{
            res.status(200).json({
                success: 'Question created',
                data: response
            })
        })
  
}

const fetchQuestion=(req,res)=>{
    var {question_id} = req.params;
    db.fetchQuestion(question_id).then( response =>{
        res.status(200).json({
            success:"Question fetched",
            data:response
        })
    })
}

const followQuestion = (user_id, question, next) => {
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

module.exports = {addQuestion,fetchQuestion, followQuestion};