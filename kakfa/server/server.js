var KafkaConnection = require('../Connection');
var auth = require('./services/auth');
var user = require('./services/user');
var course = require('./services/course');

class ServerConnection {
    constructor(producer_topic, consumer_topic) {
        console.log(`ServerConnection constructor with producer topic ${producer_topic} and consumer topic ${consumer_topic}`);
        this.producer_topic = producer_topic;
        this.consumer_topic = consumer_topic;
        console.log(`server for producer topic ${producer_topic} and consumer topic ${consumer_topic} is running`);
        this.connection = new KafkaConnection(this.producer_topic, this.consumer_topic);
        this.consumer = this.connection.getConsumer(this.consumer_topic);
        this.producer = this.connection.getProducer();
    }

    handleTopicRequest(handler) {
        this.consumer.on('message', message => {
            console.log(`message received for topic ${this.consumer_topic}, message is: `, message);
            let data = JSON.parse(message.value);
            console.log('message data is: ', data);
            handler(data.data, (err, res) => {
                console.log('message handle result: ', res);
                let payloads = [{
                    topic: data.response_topic,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res,
                    }),
                    partition: 0
                }];
                console.log(`the response payload for topic ${this.producer_topic} is: `, payloads);
                this.producer.send(payloads, function(err, data) {
                    if (err)
                        console.log(err);
                    console.log(data);
                });
            });
        });
    }
}

let authServer = new ServerConnection('response_signin', 'signin');
authServer.handleTopicRequest(auth.signin);

let userServer = new ServerConnection('response_user', 'user');
userServer.handleTopicRequest(user.dispatch);

let courseServer = new ServerConnection('response_course', 'course');
courseServer.handleTopicRequest(course.dispatch);