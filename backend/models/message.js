var mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    from_user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    from_name: String,
    from_email: String,
    to_user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    to_name: String,
    to_email: String,
    subject: {type: String, default: ''},
    content: {type: String, default: ''},
    status: {type: String, default: 'unread'},
    time: {type: Date, default: function() {
        return new Date().toUTCString();
    }}
})

module.exports =  mongoose.model('Message', MessageSchema)