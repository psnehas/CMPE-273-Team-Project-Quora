var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const AnswerSchema = new mongoose.Schema({
    user_id:{
        type: Number,
        trim: true
    },
    question_id: {
        type: Number,
        trim: true
    },
    bookmark: {
        type: Boolean
    },
    upvote: {
        type: Number
    },
    downvote: {
        type: Number
    },
    comments: [
        {
            comment_id: {type: String},
            content: {type: String}
        }
    ],

    // first_name: {
    //     type: String,
    //     trim: true,
    //     required: 'Name is required'
    // },
    // last_name : {
    //     type: String,
    //     trim: true,
    //     required: 'Name is required'
    // },
    // email: {
    //     type: String,
    //     trim: true,
    //     unique: 'Email already exists',
    //     match: [/.+@.+\..+/, 'Please fill a valid email address'],
    //     required: 'Email is require'
    // },
    // password: {
    //     type: String,
    //     required: 'Password is required'
    // },
    // avatar: {
    //     type: String,
    //     default: 'defaultphoto.png'
    // },
    // city: {type: String, default: ''},
    // state: {type: String, default: ''},
    // zipCode: {type: String, default: ''},
    // about: {type: String, default: ''},
    // educations: [
    //     {
    //         school: {type: String, default: ''},
    //         concentration: {type: String, default: ''},
    //         secondaryConcentration: {type: String, default: ''},
    //         degreeType: {type: String, default: ''},
    //         graduationYear: {type: String, default: ''},
    //     }
    // ],
    // careers : [
    //     {
    //         position: {type: String, default: ''},
    //         company: {type: String, default: ''},
    //         starYear: {type: String, default: ''},
    //         endYear: {type: String, default: ''},
    //     }
    // ],
    // profileCredential: {type: String, default: ''},
    // messages: [{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}]
})

AnswerSchema.plugin(autoIncrement, {inc_field: 'answer_id'});

module.exports =  mongoose.model('Answer', AnswerSchema);
