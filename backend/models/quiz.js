var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const QuizSchema = new mongoose.Schema({
    title: {type: String, default: ''},
    description: {type: String, default: ''},
    available: {type: Date, default: function() {
        return new Date().toUTCString();
    }},
    until: {type: Date, default: function() {
        return new Date().toUTCString();
    }},
    due: {type: Date, default: function() {
        return new Date().toUTCString();
    }},
    duration: Number,
    questions: {type: String, default: ''},
    points: {type: Number, default: 0},
    submissions: [{type: mongoose.Schema.Types.ObjectId, ref: 'QuizSubmission'}]
})

QuizSchema.plugin(autoIncrement, {inc_field: 'quiz_id'});

module.exports =  mongoose.model('Quiz', QuizSchema)