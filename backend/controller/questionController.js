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
    var {question_id} = req.body;
    db.fetchQuestion(question_id).then((response)=>{
        res.status(200).json({
            success:"Question fetched",
            data:response
        })
    })
}

module.exports = {addQuestion,fetchQuestion};