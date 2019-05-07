var mongoose= require('mongoose');

const questionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    content:{ type: String},
    topics:[{type: mongoose.Schema.Types.ObjectId, ref: 'Topic'}],
    answers:[{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
    time:{type: Date, default: function() {
            return new Date().toUTCString();
        }
    },
    followers: {type: Number, default: 0}
})

module.exports = mongoose.model('Question',questionSchema);