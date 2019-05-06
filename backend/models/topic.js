var mongoose = require('mongoose')

const TopicSchema = new mongoose.Schema({
    label: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    questions: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Question'} ],
    followers: Number
})

module.exports =  mongoose.model('Topic', TopicSchema);
