var db = require('../../../backend/lib/mongoDB')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')


const signin = (user, next) => {
    console.log('Signin request')
    let {email, password} = user;
    db.findUserByEmail(email)
    .then(result => {
        console.log(result)
        let res = {};
        if (!result) {
            res.status = 401;
            res.data = {error: 'User doesn\'t exists'};
        } else {
            if (!bcrypt.compareSync(password, result.password)){
                console.log("Signin failed, wrong password")
                res.status = 401;
                res.data = {error: 'Invalid password'};
            } else {
                const token = jwt.sign({ email: result.email, user_id: result._id }, 'quora_secret_key')
                res.status = 200;
                res.data = {
                    token,
                    user_id: result._id,
                    first_name: result.user_info.first_name,
                    last_name: result.user_info.last_name
                }
            }
        }
        next(null, res);
    })
}

const signup = (user, next) => {
    console.log('create a user: ', user);
    db.findUserByEmail(user.email)
    .then(result => {
       console.log(result)
       let res = {};
       let newUser = {user_info: {}};
        if (result) {
            res.status = 400;
            res.data = {error: 'User exists'};
            next(null, res);
        } else {
            let hashed = bcrypt.hashSync(user.password, 10)
            console.log("hashed password: " + hashed)
            newUser.password = hashed;
            newUser.email = user.email;
            newUser.user_info.first_name = user.first_name;
            newUser.user_info.last_name = user.last_name;
            console.log('new user inserted: ', newUser);
            db.insertUser(newUser)
            .then(result => {
                console.log('signup success', result)
                res.status = 200;
                res.data = {success: 'Successfully signed up'};
                next(null, res);
            })
        }
    })
}

const deactiveUser = (userid, next) => {
    db.deactiveUser(userid)
    .then(res => {
        next(null, {
            status: 200,
            data: {msg: 'User deactived'}
        })
    })
}

const getUser = (query_userid, target_userid, next) => {
    db.findUserProfileByID(target_userid)
    .then(user => {
        let res = {};
        if (user) {
            user = user.toObject();
            console.log('the user profile is: ', user.email)
            let profile = {
                user_info: {},
                created_answers: [],
                bookmarked_answers: [],
                created_questions: [],
                followed_people: [],
                following_people:[]
            };
            profile.user_info = {
                ...user.user_info,
                email: user.email,
            }
            let followed = false;
            for (let i = 0; i < user.following_people.length; i++) {
                if (user.following_people[i]._id.toString() === query_userid.toString()) {
                    followed = true;
                    break;
                }
            }
            profile.followed = followed;
            profile.active = user.active;
            console.log('the user profile is: ', profile.user_info);
            profile.created_answers = user.created_answers.sort((a, b) => {
                return a.time < b.time;
            })
            profile.bookmarked_answers = user.bookmarked_answers.sort((a, b) => {
                return a.time < b.time;
            })
            profile.created_questions = user.created_questions.sort((a, b) => {
                return a.time < b.time;
            })
            profile.followed_people = user.followed_people;
            profile.following_people = user.following_people;
            res.status = 200;
            res.data = profile;
            db.increaseProfileView(target_userid);
        } else {
            res.status = 400;
            res.data = {error: `User doesn't exist`};
        }
        next(null, res);
    })
}

const updateUserInfo = (userid, user_info, next) => {
    console.log('updateUserInfo params: ', userid, user_info);
    db.updateUserInfo(userid, user_info)
    .then(user => {
        console.log('update user info result: ', user);
        next(null, {
            status: 200,
            data: user
        })
    })
}

const getUserFeed = (userid, next) => {
    db.findTopicsByUserID(userid)
    .then(result => {
        console.log('get topics reuslt: ', result);
        let followed_topics = result.followed_topics.map(topic => topic._id);
        let feed = [], feed_question_ids = [];
        let promises = followed_topics.map(topic_id => {
            return db.findTopicDetailByID(topic_id)
            .then(topic => {
                console.log('get user feed, topic detail: ', topic);
                topic.questions.map(question => {
                    if (feed_question_ids.includes(question._id.toString()) === false) {
                        feed.push(question);
                        feed_question_ids.push(question._id.toString());
                    }
                })
            })
        })

        Promise.all(promises)
        .then(res => {
            let feed2 = [];
            while (feed.length !== 0) {
                let randomIndex = Math.floor(Math.random() * feed.length);
                feed2.push(feed[randomIndex]);
                feed.splice(randomIndex, 1);
            }
            next(null, {
                status: 200,
                data: feed2
            })
        })
    })
}

const getUserTopics = (userid, next) => {
    db.findTopicsByUserID(userid)
    .then(result => {
        console.log('topics reuslt: ', result);
        next(null, {
            status: 200,
            data: result
        })
    })
}

const getTopics = (userid, exclude, next) => {
    console.log('get all topics with userid: ', userid);
    db.getAllTopics()
    .then(all_topics => {
        console.log('get all topics reuslt: ', all_topics);
        if (exclude === 'true') {
            db.findTopicsByUserID(userid)
            .then(user_topics => {
                user_topics = user_topics.followed_topics.toObject();
                let user_topics_id = user_topics.map(topic => topic._id.toString());
                console.log('user_topics_id: ', user_topics_id);
                let excluded = all_topics.filter(topic => {
                    if (user_topics_id.includes(topic._id.toString()))
                        return false;
                    else
                        return true;
                })
                next(null, {
                    status: 200,
                    data: excluded
                })
            })
        } else {
            next(null, {
                status: 200,
                data: all_topics
            })
        }
    })
}

const followTopics = (userid, action, topic_ids, next) => {
    console.log('followTopics request, the topic_ids are: ', topic_ids);
    if (action === 'follow') {
        db.userFollowTopics(userid, topic_ids)
        .then(result => {
            console.log('follow topic result: ', result);
            topic_ids.map(topic_id => {
                db.increaseTopicCounter(topic_id);
            })
            db.findTopicsByUserID(userid)
            .then(topics => {
                next(null, {
                    status: 200,
                    data: topics
                });
            });
        });
    } else {
        db.userUnfollowTopics(userid, topic_ids)
        .then(result => {
            console.log('unfollow topic result: ', result);
            db.findTopicsByUserID(userid)
            .then(topics => {
                next(null, {
                    status: 200,
                    data: topics
                })
            })
        })
    }
}

const createTopic = (topic_name, next) => {
    db.insertTopic({label: topic_name})
    .then(result => {
        console.log('create topic reuslt: ', result);
        next(null, {
            status: 200,
            data: {success: 'Successfully created a topic'}
        })
    })
}

const getTopicQuestions = (userid, topic_id, next) => {
    db.findTopicDetailByID(topic_id)
    .then(result => {
        console.log('find topic questions result: ', result);
        result = result.toObject();
        db.findTopicsByUserID(userid)
        .then(user_topics => {
            console.log('find user topics result: ', user_topics);
            user_topics = user_topics.followed_topics.toObject();
            let user_topics_id = user_topics.map(topic => topic._id.toString());
            if (user_topics_id.includes(topic_id.toString())) {
                result.followed = true;
            } else {
                result.followed = false;
            }
            next(null, {
                status: 200,
                data: result
            })
        })
    })
}

const followUser = (following_user_id, followed_user_id, next) => {
    db.getFollowedPeople(following_user_id)
    .then(people_list => {
        console.log('get followed people list result: ', people_list);
        for (let i = 0; i < people_list.followed_people.length; i++) {
            if (people_list.followed_people[i].toString() === followed_user_id.toString()) {
                return next(null, {
                    status: 400,
                    data: {msg: 'Already followed this user'}
                })
            }
        }
        db.followedPeople(following_user_id, followed_user_id)
        .then(res => {
            db.followingPeople(followed_user_id, following_user_id)
            .then(res => {
                return next(null, {
                    status: 200,
                    data: {msg: 'Follow user successed'}
                })
            })
        })
    })
}

const unfollowUser = (unfollowing_user_id, unfollowed_user_id, next) => {
    db.unfollowedPeople(unfollowing_user_id, unfollowed_user_id)
    .then(res => {
        db.unfollowingPeople(unfollowed_user_id, unfollowing_user_id)
        .then(res => {
            return next(null, {
                status: 200,
                data: {msg: 'Unfollow user successed'}
            })
        })
    })
}

const getUserMessages = (userid, next) => {
    db.getMessagesByUserID(userid)
    .then(result => {
        console.log('Get user messages query result: ', result);
        next(null, {
            status: 200,
            data: result.messages
        })
    })
}

const createUserMessage = (message, next) => {
    const {subject, content, to_email, userid} = message;
    db.findUserByEmail(to_email)
    .then(to => {
        let touser = to.toObject();
        db.findUserByID(userid)
        .then(from => {
            let fromuser = from.toObject();
            let message = {
                from_user_id: fromuser._id,
                from_name: fromuser.name,
                from_email: fromuser.email,
                to_user_id: touser._id,
                to_name: touser.name,
                to_email: touser.email,
                subject,
                content,
            }
            db.insertMessage(touser._id, message)
            .then(() => {
                message.status = 'readed';
                db.insertMessage(fromuser._id, message)
                .then(() => {
                    getUserMessages(userid, next);
                })
            })
        })
    })
}

const readMessage = (messageid, next) => {
    db.readMessage(messageid)
    .then(() => {
        next(null, {
            status: 200,
            data: {}
        })
    })
}

const getUserActivities = (userid, next) => {
    db.getUserActivites(userid)
    .then(res => {
        console.log('get user activities result are: ', res);
        next(null, {
            status: 200,
            data: res
        })
    })
}

const dispatch = (message, next) => {
    switch (message.cmd) {
        case 'SIGN_IN':
            signin(message.user, next);
            break;
        case 'SIGN_UP':
            signup(message.user, next);
            break;
        case 'GET_USER':
            getUser(message.query_userid, message.target_userid, next);
            break;
        case 'UPDATE_USER_INFO':
            updateUserInfo(message.userid, message.user_info, next);
            break;
        case 'GET_FEED':
            getUserFeed(message.userid, next);
            break;
        case 'GET_USER_TOPICS':
            getUserTopics(message.userid, next);
            break;
        case 'GET_TOPICS':
            getTopics(message.userid, message.exclude, next);
            break;
        case 'FOLLOW_TOPICS':
            followTopics(message.userid, message.action, message.topic_ids, next);
            break;
        case 'CREATE_TOPIC':
            createTopic(message.topic_name, next);
            break;
        case 'GET_TOPIC_QUESTIONS':
            getTopicQuestions(message.userid, message.topic_id, next);
            break;
        case 'GET_MESSAGE':
            getUserMessages(message.userid, next);
            break;
        case 'CREATE_MESSAGE':
            createUserMessage(message.message, next);
            break;
        case 'READ_MESSAGE':
            readMessage(message.messageid, next);
            break;
        case 'FOLLOW_PEOPLE':
            followUser(message.following_user_id, message.followed_user_id, next);
            break;
        case 'UNFOLLOW_PEOPLE':
            unfollowUser(message.unfollowing_user_id, message.unfollowed_user_id, next);
            break;
        case 'DEACTIVE':
            deactiveUser(message.userid, next);
            break;
        case 'USER_ACTIVITIES':
            getUserActivities(message.user_id, next);
            break;
        default:
            console.log('unknown request');
    }
}

module.exports = {dispatch}
