var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const TopicSchema = new mongoose.Schema({
    label: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    questions: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Question'} ]
})

TopicSchema.plugin(autoIncrement, {inc_field: 'topic_id'});

module.exports =  mongoose.model('Topic', TopicSchema);
