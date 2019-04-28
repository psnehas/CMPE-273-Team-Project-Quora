var mongoose = require('mongoose')
var User = require('../models/user')
var Topic = require('../models/topic')
var Message = require('../models/message')
var Answer = require('../models/answer')

const uri_altas = 'mongodb+srv://admin:admin@quora-2jksh.mongodb.net/';
const uri_local = 'mongodb://localhost:27017/quora';
mongoose.Promise = global.Promise
mongoose.connect(uri_altas, {
    dbName: 'quora',
    useNewUrlParser: true,
    poolSize: 100,
    useFindAndModify: false,
    keepAlive: true, 
    keepAliveInitialDelay: 300000,
    useCreateIndex: true
})

mongoose.connection.once('open', () => {
    console.log('connection to mongoDB is open');
})

mongoose.connection.on('connecting', () => {
    console.log('connecting to mongoDB');
})
mongoose.connection.on('connected', () => {
    console.log('connected to mongoDB');
})
mongoose.connection.on('disconnected', () => {
    console.log('lost connection to mongoDB');
})
mongoose.connection.on('close', () => {
    console.log('connection to mongoDB was closed')
})
mongoose.connection.on('error', () => {
    throw new Error('unable to connect to mongoDB')
})


exports.insertUser = (user) => {
    let newUser = new User(user);
    return newUser.save();
}

exports.findUserByEmail = (email) => {
    console.log('findUserByEmail: ', email);
    return User.findOne({email: email}).exec();
}

exports.findUserByID = (id) => {
    return User.findById(id).exec();
}

exports.findAvatarPathByID = (id) => {
    return User.findById(id).exec();
}

exports.findFeedByUserID = (id) => {
    return User.findById(id).select('feeded_q_a -_id').exec();
    /*
    .then(feed => {
        let question_id = feed.question_id;
        return Question.findOne({question_id})
    });
    */
}

exports.findTopicsByUserID = (id) => {
    return User.findById(id).populate('followed_topics', 'name topic_id')
    .select('followed_topics -_id').exec();
}

exports.insertTopic = (name) => {
    let newTopic = new Topic(name);
    return newTopic.save();
}

exports.userFollowTopics = (userid, topic_ids) => {
    return User.findOneAndUpdate({_id: userid}, {$push: {followed_topics: topic_ids}}).exec();
}

exports.userUnfollowTopics = (userid, topic_ids) => {
    return User.findByIdAndUpdate({_id: userid}, {$pull: {followed_topics: topic_ids[0]}}).exec();
}

exports.updateUser = (user) => {
    return User.findOneAndUpdate({_id: user.id}, user).exec();
}

//Answer
exports.upvoteAnswer = (answerid) => {
    return Answer.findOneAndUpdate({answer_id: answerid}, {$inc : {upvote : 1}}).exec();
}

exports.downvoteAnswer = (answerid) => {
    return Answer.findOneAndUpdate({answer_id: answerid}, {$inc : {downvote : 1}}).exec();
}

exports.getVotes = (answerid) => {
    return Answer.findOne({answer_id: answerid}).exec();
}

exports.getComments = (answerid) => {
    return Answer.find({answer_id: answerid}).exec();
}

exports.createComment = (answerid, comment) => {
    return Answer.findOneAndUpdate({answer_id: answerid}, {$push: {comments: {comment: comment}}}).exec();
}

exports.createAnswer = (data) => {
    let newAnswer = new Answer(data);
    return newAnswer.save();
}

exports.setBookmark = (userid, answerid) => {
    return Answer.findOneAndUpdate({answer_id: answerid}, {$push: {bookmark: {user_id: userid}}}).exec();
}

exports.findOneAnswer = (answerid) => {
    return Answer.findOne({answer_id: answerid}).exec();
}

exports.updateOneAnswer = (editInfo) => {
    return Answer.findOneAndUpdate({answer_id: editInfo.answer_id}, {$set: {content: editInfo.content}}).exec();
}