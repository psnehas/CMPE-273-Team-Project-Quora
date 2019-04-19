var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const SubmissionSchema = new mongoose.Schema({
    submission_id: Number,
    user_id: Number,
    assignment_id: Number,
    filename: {type: String, default: ''},
    mimetype: {type: String, default: ''},
    submitdt: {type: Date, default: function() {
        return new Date().toUTCString();
    }},
    grades: {type: Number, default: 0}
})

SubmissionSchema.plugin(autoIncrement, {inc_field: 'submission_id'});

module.exports =  mongoose.model('Submission', SubmissionSchema)