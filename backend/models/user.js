var mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    user_info: {
        first_name: {
            type: String,
            trim: true,
            required: 'Name is required'
        },
        last_name: {
            type: String,
            trim: true,
            required: 'Name is required'
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
        profileCredential: {type: String, default: ''},
    },
    password: {
        type: String,
        required: 'Password is required'
    },
    email: {
        type: String,
        trim: true,
        unique: 'Email already exists',
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is require'
    },
    avatar: {
        type: String,
        default: 'defaultphoto.png'
    },
    active: {type: Boolean, default: true},
    followed_people: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    following_people: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    created_questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    followed_questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}],
    created_answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
    bookmarked_answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
    followed_topics: [{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}],
    messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
    activities:[
        {
            obj: {type: mongoose.Schema.Types.ObjectId, refPath: 'activities.onObj'},
            onObj: {type: String, enum:['Question', 'Answer']},
            action: {type: String},
            time:{type: Date, default: function() {
                    return new Date().toUTCString();
                }
            }
        }
    ]
})

module.exports =  mongoose.model('User', UserSchema);
