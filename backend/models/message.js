var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const MessageSchema = mongoose.Schema({
    from_user_id: Number,
    from_name: String,
    from_email: String,
    to_user_id: Number,
    to_name: String,
    to_email: String,
    subject: {type: String, default: ''},
    content: {type: String, default: ''},
    status: {type: String, default: 'unread'},
    time: {type: Date, default: function() {
        return new Date().toUTCString();
    }}
})

MessageSchema.plugin(autoIncrement, {inc_field: 'message_id'});

module.exports =  mongoose.model('Message', MessageSchema)