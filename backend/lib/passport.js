var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');
var passport = require('passport');
var redis = require('./redis');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'quora_secret_key'
}, function(jwt_payload, done) {
    console.log('In passport verification, the jwt_payload is: ', jwt_payload);
    redis.get(jwt_payload.email)
    .then(result => {
        if (!result) {
            console.log('no user info in redis, retrive it from db');
            User.findOne({email: jwt_payload.email}, function(err, user){
                console.log('find user result: ', user);
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    redis.set(jwt_payload.email, JSON.stringify(jwt_payload))
                    .then(() => {
                        return done(null, jwt_payload);
                    });
                } else {
                    return done(null, false);
                }
            });
        } else {
            console.log('retrived user info from redis');
            return done(null, JSON.parse(result));
        }
    })
    /*
    User.findOne({email: jwt_payload.email}, function(err, user) {
        console.log('find user result: ', user);
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, jwt_payload);
        } else {
            return done(null, false);
        }
    });
    */
}));

const requireSigninPassport = passport.authenticate('jwt', {session: false});

module.exports = {passport, requireSigninPassport};