var mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
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
    bookmark: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    comments: [CommentSchema]
})

module.exports =  mongoose.model('Answer', AnswerSchema);
