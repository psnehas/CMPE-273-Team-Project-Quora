var mongoose = require('mongoose')

const FileSchema = new mongoose.Schema({
    course_id: Number,
    filename: {type: String, default: ''},
    size: {type: String, default: ''},
    createdate: {type: Date, default: function() {
        return new Date().toUTCString();
    }},
})

module.exports =  mongoose.model('File', FileSchema)