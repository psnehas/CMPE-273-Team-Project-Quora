var mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)

const TopicSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
})

TopicSchema.plugin(autoIncrement, {inc_field: 'topic_id'});

module.exports =  mongoose.model('Topic', TopicSchema);
