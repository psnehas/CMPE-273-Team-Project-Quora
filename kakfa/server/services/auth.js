var db = require('../../../Backend/lib/mongoDB')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

const signin = (message, next) => {
    console.log('Signin request')
    let {email, password} = message;
    db.findUserByEmail(email)
    .then(result => {
        console.log(result)
        let res = {};
        if (result.length == 0) {
            res.status = 400;
            res.data = {error: 'User doesn\'t exists'};
        } else {
            if (!bcrypt.compareSync(password, result[0]['password'])){
                console.log("Signin failed, wrong password")
                res.status = 400;
                res.data = {error: 'Invalid password'};
            } else {
                const token = jwt.sign({ email: result[0].email }, 'canvas_secret_key')
                res.status = 200;
                res.data = {
                    token,
                    userid: result[0]['user_id'],
                    role: result[0]['role']
                }
            }
        }
        next(null, res);
    })
}

module.exports = {signin}