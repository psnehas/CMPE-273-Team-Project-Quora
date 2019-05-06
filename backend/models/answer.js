var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const CommentSchema = new mongoose.Schema({
    owner: {
        type: String // email
    },
    time: {
        type: Date
    },
    comment: {
        type: String
    },
    anonymous: {
        type: Boolean
    }
})

const AnswerSchema = new mongoose.Schema({
    question_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Question'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    time: {
        type: Date
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
    anonymous: {
        type: Boolean
    },
    bookmark: [
        {
            user_id: {type: String}
        }
    ],
    comments: [CommentSchema]
})


CommentSchema.plugin(autoIncrement, {inc_field: 'comment_id'});
AnswerSchema.plugin(autoIncrement, {inc_field: 'answer_id'});

module.exports =  mongoose.model('Answer', AnswerSchema);
