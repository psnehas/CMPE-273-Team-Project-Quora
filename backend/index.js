var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var cookieParse = require('cookie-parser');

var userRouter = require('./routers/userRouter')
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

// for load balancer
app.use('/*', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

let server = app.listen(app.get('port'), () => {
    console.log('Server is running on port: ', app.get('port'));
})

function stop() {
    server.close()
}

module.exports = server
module.exports.stop = stop