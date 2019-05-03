var mongoose= require('mongoose');
var autoIncrement = require('mongoose-sequence')(mongoose)
const questionSchema = new mongoose.Schema({
    user_id: {
        type: Number, 
        ref:'User'
     },
    display_name:{
        type: String
    },
    question_text:{
        type: String
    },
    questionTopics:[{
        topic_id:{
            type: Number,
             ref:'Topic'
            },
        name:{
            type:String
        }
    }],
    answer_ids:[{
        type:Number,
         ref:'Answer'
        }],
    dateCreated:{
        type: Date
    }
})
questionSchema.plugin(autoIncrement,{inc_field: 'question_id'});
module.exports = mongoose.model('Question',questionSchema);