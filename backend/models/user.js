var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is require'
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    avatar: {
        type: String,
        default: 'defaultphoto.png'
    },
    phone: {type: String, default: ''},
    about: {type: String, default: ''},
    city: {type: String, default: ''},
    country: {type: String, default: ''},
    company: {type: String, default: ''},
    school: {type: String, default: ''},
    hometown: {type: String, default: ''},
    languages: {type: String, default: ''},
    gender: {type: String, default: ''},
    role: {type: String, default: ''},
    courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
})

UserSchema.plugin(autoIncrement, {inc_field: 'user_id'});

module.exports =  mongoose.model('User', UserSchema);
