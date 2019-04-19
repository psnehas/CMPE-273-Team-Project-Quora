var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');
var passport = require('passport');

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'canvas_secret_key'
}, function(jwt_payload, done) {
    console.log('In passport verification, the jwt_payload is: ', jwt_payload);
    User.findOne({email: jwt_payload.email}, function(err, user){
        console.log('find user result: ', user);
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

const requireSigninPassport = passport.authenticate('jwt', {session: false});

module.exports = {passport, requireSigninPassport};