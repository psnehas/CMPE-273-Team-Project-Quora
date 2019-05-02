var KafkaConnection = require('../Connection');
var user = require('./services/user');
var answer = require('./services/answer')

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

let userServer = new ServerConnection('response_user', 'user');
userServer.handleTopicRequest(user.dispatch);

let answerServer = new ServerConnection('response_answer', 'answer');
answerServer.handleTopicRequest(answer.dispatch);