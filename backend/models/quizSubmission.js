var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const QuizSubmissionSchema = new mongoose.Schema({
    user_id: Number,
    quiz_id: Number,
    submitdt: {type: Date, default: function() {
        return new Date().toUTCString();
    }},
    grades: {type: Number, default: 0}
})

module.exports =  mongoose.model('QuizSubmission', QuizSubmissionSchema)