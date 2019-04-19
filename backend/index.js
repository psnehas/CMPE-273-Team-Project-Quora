var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParse = require('cookie-parser');

var userRouter = require('./routers/userRouter')
var authRouter = require('./routers/authRouter')
var courseRouter = require('./routers/courseRouter')

var passport = require('./lib/passport')

const app = express();

app.set('port', 8080);

app.use(cors());
app.use(passport.passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))
app.use(cookieParse());

app.use('/public/images', express.static(__dirname + '/public/images'))

app.use('/', userRouter.router)
app.use('/', courseRouter.router)
app.use('/', authRouter.router)

let server = app.listen(app.get('port'), () => {
    console.log('Server is running on port: ', app.get('port'));
})

function stop() {
    server.close()
}

module.exports = server
module.exports.stop = stop