var mongoose = require('mongoose')

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
    careers: [
        {
            position: {type: String, default: ''},
            company: {type: String, default: ''},
            starYear: {type: String, default: ''},
            endYear: {type: String, default: ''},
        }
    ],
    followed_people: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    following_people: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    followed_questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}],
    followed_topics: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}],
    profileCredential: {type: String, default: ''},
    feeded_q_a: [ 
        {
            question_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Question'},
            question_body: String,
        }
    ],
    activities: {
        questions:[ Date ],
        answers: [ Date ],
        comments: [ Date ],
    },
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
})

module.exports =  mongoose.model('User', UserSchema);
