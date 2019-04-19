var mongoose = require('mongoose')

CourseSchema = new mongoose.Schema({
    id: Number,
    course_id: Number,
    name: String,
    dept: String,
    description: String,
    room: String,
    capacity: Number,
    waitlistCapacity: Number,
    term: String,
    occupied: Number,
    waiting: Number,
    instructor: String,
    needCode: String,
    announcements: [{type: mongoose.Schema.Types.ObjectId, ref: 'Announcement'}],
    assignments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Assignment'}],
    quizzes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Quiz'}],
    people: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    files: [{type: mongoose.Schema.Types.ObjectId, ref: 'File'}]
});

module.exports =  mongoose.model('Course', CourseSchema)