var db = require('../lib/mysql')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var expressJwt = require('express-jwt')

const signin = (req, res) => {
    console.log('Signin request')
    let {email, password} = req.body;
    db.findUserByEmail(email)
    .then(result => {
        console.log(result)
        if (result.length == 0) {
            res.status(400).json({
                error: 'User doesn\'t exists'
            })
        } else {
            if (!bcrypt.compareSync(password, result[0]['password'])){
                console.log("Signin failed, wrong password")
                res.status(401).json({
                    error: 'Invalid password'
                })
            } else {
                const token = jwt.sign({ id:result[0]['id'] }, 'canvas_secret_key')
                res.cookie('canvas', token, { expires: new Date(Date.now() + 900000) })
                res.status(200).json({
                    token,
                    userid: result[0]['id'],
                    role: result[0]['role']
                })
            }
        }
    })
}

const requireSignin = expressJwt({
    secret: 'canvas_secret_key',
    userProperty: 'auth'
})

module.exports = {signin, requireSignin}