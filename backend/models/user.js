var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    last_name : {
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
    city: {type: String, default: ''},
    state: {type: String, default: ''},
    zipCode: {type: String, default: ''},
    about: {type: String, default: ''},
    educations: [
        {
            school: {type: String, default: ''},
            concentration: {type: String, default: ''},
            secondaryConcentration: {type: String, default: ''},
            degreeType: {type: String, default: ''},
            graduationYear: {type: String, default: ''},
        }
    ],
    careers : [
        {
            position: {type: String, default: ''},
            company: {type: String, default: ''},
            starYear: {type: String, default: ''},
            endYear: {type: String, default: ''},
        }
    ],
    profileCredential: {type: String, default: ''},
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
})

UserSchema.plugin(autoIncrement, {inc_field: 'user_id'});

module.exports =  mongoose.model('User', UserSchema);
