var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const CommentSchema = new mongoose.Schema({
    owner: {
        type: Number // user_id
    },
    time: {
        type: String
    },
    comment: {
        type: String
    }
})

const AnswerSchema = new mongoose.Schema({
    question_id: {
        type: Number,
        trim: true
    },
    owner: {
        type: Number // user_id
    },
    time: {
        type: String
    },
    content: {
        type: String
    },
    upvote: {
        type: Number
    },
    downvote: {
        type: Number
    },
    bookmark: [
        {
            user_id: {type: Number}
        }
    ],
    comments: [CommentSchema]
})


CommentSchema.plugin(autoIncrement, {inc_field: 'comment_id'});
AnswerSchema.plugin(autoIncrement, {inc_field: 'answer_id'});

module.exports =  mongoose.model('Answer', AnswerSchema);
