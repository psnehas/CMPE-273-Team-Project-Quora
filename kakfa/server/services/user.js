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

const getUser = (userid, next) => {
    db.findUserProfileByID(userid)
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
                email: user.email
            }
            console.log('the user profile is: ', profile.user_info);
            profile.created_answers = user.created_answers.sort((a, b) => {
                return a.time > b.time;
            })
            profile.bookmarked_answers = user.bookmarked_answers.sort((a, b) => {
                return a.time > b.time;
            })
            profile.created_questions = user.created_questions.sort((a, b) => {
                return a.time > b.time;
            })
            profile.followed_people = user.followed_people;
            profile.following_people = user.following_people;
            res.status = 200;
            res.data = profile;
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
    /*
    db.findFeedByUserID(userid)
    .then(result => {
        console.log('feed reuslt: ', result);
        next(null, {
            status: 200,
            data: result
        })
    })
    */
   next(null, {
       status: 200,
       data: {feeded_q_a: []}
   });
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

const getTopics = (next) => {
    db.getAllTopics()
    .then(result => {
        console.log('get all topics reuslt: ', result);
        next(null, {
            status: 200,
            data: result
        })
    })
}

const followTopics = (userid, action, topic_ids, next) => {
    console.log('followTopics request, the typeof follow is: ', typeof follow);
    if (action === 'follow') {
        db.userFollowTopics(userid, topic_ids)
        .then(result => {
            console.log('follow topic result: ', result);
            next(null, {
                status: 200,
                success: true
            })
        })
    } else {
        db.userUnfollowTopics(userid, topic_ids)
        .then(result => {
            console.log('unfollow topic result: ', result);
            next(null, {
                status: 200,
                success: true
            })
        })
    }
}

const createTopic = (topic_name, next) => {
    db.insertTopic({name: topic_name})
    .then(result => {
        console.log('create topic reuslt: ', result);
        next(null, {
            status: 200,
            data: {success: 'Successfully created a topic'}
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
                from_user_id: fromuser.user_id,
                from_name: fromuser.name,
                from_email: fromuser.email,
                to_user_id: touser.user_id,
                to_name: touser.name,
                to_email: touser.email,
                subject,
                content,
            }
            db.insertMessage(touser.user_id, message)
            .then(() => {
                message.status = 'readed';
                db.insertMessage(fromuser.user_id, message)
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

const dispatch = (message, next) => {
    switch (message.cmd) {
        case 'SIGN_IN':
            signin(message.user, next);
            break;
        case 'SIGN_UP':
            signup(message.user, next);
            break;
        case 'GET_USER':
            getUser(message.userid, next);
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
            getTopics(next);
            break;
        case 'FOLLOW_TOPICS':
            followTopics(message.userid, message.action, message.topic_ids, next);
            break;
        case 'CREATE_TOPIC':
            createTopic(message.topic_name, next);
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
        default:
            console.log('unknown request');
    }
}

module.exports = {dispatch}
