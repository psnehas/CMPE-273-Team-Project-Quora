var mongoose = require('mongoose')
var User = require('../models/user')
var Topic = require('../models/topic')
var Message = require('../models/message')
var Answer = require('../models/answer')
var Question = require('../models/question')

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

exports.findUserProfileByID = (id) => {
    return User.findById(id)
    .populate({
        path: 'created_answers',
        select: 'question_id time',
    })
    .populate({
        path: 'bookmarked_answers',
        select: 'question_id time',
    })
    .populate({
        path: 'created_questions',
        select: 'content time',
    })
    .populate({
        path: 'followed_people',
        select: 'first_name last_name',
    })
    .populate({
        path: 'following_people',
        select: 'first_name last_name'
    })
    .select('user_info email').exec();
}

exports.updateUserInfo = (id, user_info) => {
    return User.findByIdAndUpdate(id, {$set: {user_info: user_info}}, {new: true}).exec();
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
    return User.findById(id).populate('followed_topics', 'label')
    .select('followed_topics -_id').exec();
}

exports.getAllTopics = () => {
    return Topic.find({}).select('label').exec();
}

exports.insertTopic = (name) => {
    let newTopic = new Topic(name);
    return newTopic.save();
}

exports.userFollowTopics = (userid, topic_ids) => {
    console.log('userFollowTopics with topic_ids: ', topic_ids);
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
    return Answer.findOneAndUpdate({_id: answerid}, {$inc : {upvote : 1}}).exec();
}

exports.downvoteAnswer = (answerid) => {
    return Answer.findOneAndUpdate({_id: answerid}, {$inc : {downvote : 1}}).exec();
}

exports.getVotes = (answerid) => {
    return Answer.findOne({_id: answerid}).exec();
}

exports.getComments = (answerid) => {
    return Answer.findOne({_id: answerid}).exec();
}

exports.createComment = (comment) => {
    return Answer.findOneAndUpdate({_id: comment.answer_id}, {$push: {comments: {owner: comment.owner, time : comment.time, comment : comment.comment, anonymous: comment.anonymous}}}).exec();
}

exports.createAnswer = (data) => {
    let newAnswer = new Answer(data);
    return newAnswer.save();
}

exports.setBookmark = (userid, answerid) => {
    return Answer.findOneAndUpdate({_id: answerid}, {$push: {bookmark: {user_id: userid}}}).exec();
}

exports.findOneAnswer = (answerid) => {
    return Answer.findOne({_id: answerid}).exec();
}

exports.updateOneAnswer = (editInfo) => {
    return Answer.findOneAndUpdate({_id: editInfo.answer_id}, {$set: {content: editInfo.content, time: editInfo.time}}).exec();
}

exports.updateUserWithAnswer = (user, newAnswer) => {
    return User.findOneAndUpdate({_id: user}, {$push: {created_answers: newAnswer._id}}).exec();
}

exports.updateQuestionWithAnswer = (questionid, newAnswer) => {
    return Question.findOneAndUpdate({_id: questionid}, {$push: {answers: newAnswer._id}}).exec();
}

exports.updateUserBookmark = (userid, answerid) => {
    return User.findOneAndUpdate({_id: userid}, {$push: {bookmarked_answers: answerid._id}}).exec();
}

exports.getOwnerOfAnswer = (answerid) => {
    return Answer.findById(answerid)
    .populate({
        path: 'owner',
        select: 'user_info.first_name user_info.last_name user_info.profileCredential',
    }).select('owner anonymous').exec();
}

//question
exports.insertQuestion = (question) => {
    let newQuestion = new Question(question)
    return newQuestion.save();
}

exports.bindUserQuestion = (user_id, question_id) => {
    return User.findByIdAndUpdate(user_id, {$push: {created_questions: question_id}}).exec();
}

exports.fetchQuestion =(question_id)=>{
    return Question.findOne({question_id:question_id}).exec();
}