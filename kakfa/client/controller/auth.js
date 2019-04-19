const ClientConnection = require('../client')

let client = new ClientConnection('signin', 'response_signin');
client.init();

const signin = (req, res) => {
    console.log('signin request with kafka client');
    client.send(req.body, function(err, result) {
        console.log('the result for topic response_signin is: ', result);
        res.status(result.status).json(result.data);
    })
}

module.exports = {signin} 