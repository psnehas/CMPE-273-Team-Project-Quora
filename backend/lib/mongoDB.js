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
    dbName: 'quora-new',
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

exports.deactiveUser = (userid) => {
    return User.findByIdAndUpdate(userid, {$set: {active: false}}).exec();
}

exports.findUserByEmail = (email) => {
    console.log('findUserByEmail: ', email);
    return User.findOne({email: email}).exec();
}

exports.findUserByID = (id) => {
    return User.findById(id).exec();
}

exports.findUserProfileByID = (id) => {
    return User.findById(id)
    .populate({
        path: 'created_answers',
        populate: {
            path: 'question_id',
            select: 'content'
        },  
        select: 'question_id time',
    })
    .populate({
        path: 'bookmarked_answers',
        populate: {
            path: 'question_id',
            select: 'content'
        },  
        select: 'question_id time',
    })
    .populate({
        path: 'created_questions',
        select: 'content time',
    })
    .populate({
        path: 'followed_people',
        select: 'user_info.first_name user_info.last_name',
    })
    .populate({
        path: 'following_people',
        select: 'user_info.first_name user_info.last_name',
    })
    .select('user_info email active').exec();
}

exports.findUserFollowedQuestions = (id) => {
    return User.findById(id)
    .populate({
        path: 'followed_questions',
    })
    .select('followed_questions').exec();
}

exports.updateUserInfo = (id, user_info) => {
    return User.findByIdAndUpdate(id, {$set: {user_info: user_info}}, {new: true}).exec();
}

exports.findAvatarPathByID = (id) => {
    return User.findById(id).exec();
}

exports.updateUserAvatar = (user_id, avatar) => {
    return User.findByIdAndUpdate(user_id, {$set: {avatar: avatar}}).exec();
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
    return User.findOneAndUpdate({_id: userid}, {$push: {followed_topics: topic_ids}}, {new: true}).exec();
}

exports.increaseTopicCounter = (topic_id) => {
    return Topic.findByIdAndUpdate(topic_id, {$inc: {followers: 1}}, {new: true}).exec();
}

exports.userUnfollowTopics = (userid, topic_ids) => {
    return User.findByIdAndUpdate({_id: userid}, {$pull: {followed_topics: topic_ids[0]}}, {new: true}).exec();
}

exports.findTopicDetailByID = (topic_id) => {
    return Topic.findById(topic_id)
    .populate({
        path: 'questions',
        populate: [{
            path: 'answers',
            options: {limit: 1},
            populate: {
                path: 'owner',
                select: 'user_info.first_name user_info.last_name user_info.profileCredential'
            },
            select: 'time content anonymous'
        },
        {
            path: 'topics',
            select: 'label'
        }],
        select: 'content answers topics'
    })
    .exec();
}

exports.getFollowedPeople = (userid) => {
    return User.findById(userid).select('followed_people').exec();
}

exports.followedPeople = (following_user_id, followed_user_id) => {
    return User.findByIdAndUpdate(following_user_id, {$push: {followed_people: followed_user_id}}).exec();
}

exports.followingPeople = (followed_user_id, following_user_id) => {
    return User.findByIdAndUpdate(followed_user_id, {$push: {following_people: following_user_id}}).exec();
}

exports.unfollowedPeople = (following_user_id, followed_user_id) => {
    return User.findByIdAndUpdate(following_user_id, {$pull: {followed_people: followed_user_id}}).exec();
}

exports.unfollowingPeople = (followed_user_id, following_user_id) => {
    return User.findByIdAndUpdate(followed_user_id, {$pull: {following_people: following_user_id}}).exec();
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
    return Answer.findOne({_id: answerid})
    .populate({
        path: 'comments.owner',
        select: 'user_info.first_name user_info.last_name user_info.profileCredential',
    }).select('comments').exec();
}

exports.createComment = (comment) => {
    return Answer.findOneAndUpdate({_id: comment.answer_id}, {$push: {comments: {owner: comment.owner, time : comment.time, comment : comment.comment, anonymous: comment.anonymous}}}).exec();
}

exports.createAnswer = (data) => {
    let newAnswer = new Answer(data);
    return newAnswer.save();
}

exports.setBookmark = (userid, answerid) => {
    return Answer.findOneAndUpdate({_id: answerid}, {$push: {bookmark: {_id: userid}}}).exec();
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

exports.bindTopicQuestion = (topic_id, question_id) => {
    return Topic.findByIdAndUpdate(topic_id, {$push: {questions: question_id}}).exec();
}

exports.fetchQuestion = (question_id) =>{
    return Question.findOne({_id: question_id})
    .populate({
        path: 'answers',
        populate: {
            path: 'owner',
            select: 'user_info.first_name user_info.last_name user_info.profileCredential',
        },
        select: '_id owner time content upvote downvote anonymous'
    })
    .populate({
        path: 'topics',
        select: '_id label'
    })
    .select('_id content time followers answers topics')
    .exec();
}

exports.increaseFollowerCounter = (question_id) => {
    return Question.findByIdAndUpdate(question_id, {$inc: {followers: 1}}, {new: true}).exec();
}

exports.userFollowQuestion = (user_id, question_id) => {
    return User.findByIdAndUpdate(user_id, {$push: {followed_questions: question_id}}).exec();
}

exports.recordQuestionAsked = (user_id, question_id) => {
    return User.findByIdAndUpdate(user_id, {$push: {activities: {obj: question_id, onObj: 'Question', action: 'question_asked'}}}).exec();
}

exports.recordQuestionFollowed = (user_id, question_id) => {
    return User.findByIdAndUpdate(user_id, {$push: {activities: {obj: question_id, onObj: 'Question', action: 'question_followed'}}}).exec();
}

exports.recordAnswer = (user_id, answer_id) => {
    return User.findByIdAndUpdate(user_id, {$push: {activities: {obj: answer_id, onObj: 'Answer', action:'answer'}}}).exec();
}

exports.getUserActivites = (user_id) => {
    return User.findById(user_id)
    .populate({path: 'activities.obj'})
    .select('activities').exec();
}

exports.search = (catagory, content) => {
    switch(catagory) {
        case 'user':
            return User.find({ email: { $regex: content, $options: 'i' }})
            .select('_id email').exec();             
        case 'question':
            return Question.find({ content: { $regex: content, $options: 'i' } })
            .select('_id content').exec();             
        case 'topic':
            return Topic.find({ label: { $regex: content, $options: 'i' } })
            .select('_id label').exec();             
        default: console.log('unknown request');
    }
    return new Promise((resolve, reject) => {
        resolve([]);
    });
}

exports.getMessagesByUserID = (userid) => {
    return User.findById(userid)
        .populate({
            path: 'messages',
            select: 'from_email subject content'
        }).select('messages -_id').exec();
}

exports.insertMessage = (userid, message) => {
    const newMessage = new Message(message);
    return newMessage.save()
    .then(message => {
        return User.findOneAndUpdate({_id: userid}, {$push: {messages: message._id}}).exec();
    });
}

exports.increaseView = (answerid) => {
    return Answer.findByIdAndUpdate(answerid, {$inc: {view: 1}}).exec();
}

exports.increaseProfileView = (userid) => {
    return User.findByIdAndUpdate(userid, {$inc: {view: 1}}).exec();
}

exports.findAllAnswersByView = () => {
    return Answer.find({}).sort({view: -1}).limit(5).exec();
}

exports.findAllAnswersByUpvotes = () => {
    return Answer.find({}).sort({upvote: -1}).limit(5).exec();
}

exports.findAllAnswersByDownvotes = () => {
    return Answer.find({}).sort({downvote: -1}).limit(5).exec();
}