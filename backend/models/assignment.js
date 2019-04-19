var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const AssignmentSchema = new mongoose.Schema({
    assignment_id: Number,
    title: {type: String, default: ''},
    content: {type: String, default: ''},
    due: {type: Date, default: function() {
        return new Date().toUTCString();
    }},
    points: {type: Number, default: 0},
    status: {type: String, default:'open'},
    submissions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Submission'}]
})

AssignmentSchema.plugin(autoIncrement, {inc_field: 'assignment_id'});

module.exports =  mongoose.model('Assignment', AssignmentSchema)