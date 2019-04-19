var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const AnnouncementSchema = new mongoose.Schema({
    announcement_id: Number,
    title: {type: String, default: ''},
    content: {type: String, default: ''},
    dt: {type: Date, default: function() {
        return new Date().toUTCString();
    }}
})

AnnouncementSchema.plugin(autoIncrement, {inc_field: 'announcement_id'});

module.exports =  mongoose.model('Announcement', AnnouncementSchema)