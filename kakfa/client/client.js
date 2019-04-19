const KafkaConnection = require('../Connection');
var uuid = require('uuid/v4');

module.exports = class ClientConnection {
    constructor(producer_topic, consumer_topic) {
        console.log(`ClientConnection constructor with producer topic ${producer_topic} and consumer topic ${consumer_topic}`);
        this.producer_topic = producer_topic;
        this.consumer_topic = consumer_topic;
    }

    init() {
        console.log('ClientConnection init');
        this.requests = new Map();
        this.connection = new KafkaConnection(this.producer_topic, this.consumer_topic);
        this.producer = this.connection.getProducer();
        this.consumer = this.connection.getConsumer(this.consumer_topic);
        this.consumer.on('message', message => {
            console.log('message received on topic: ', this.consumer_topic);
            let data = JSON.parse(message.value);
            console.log('message data is: ', data);
            var correlationId = data.correlationId;
            if(this.requests.has(correlationId)){
                let entry = this.requests.get(correlationId);
                clearTimeout(entry.timeout);
                this.requests.delete(correlationId);
                entry.callback(null, data.data);
            }
        })
    }

    send(content, next) {
        console.log('ClientConnection send');
        let correlationId = uuid();
        let timer = setTimeout(cor_id => {
            console.log(`timeout on topic ${this.producer_topic}, the content is`, content);
            next(new Error('timeout ' + cor_id));
            this.requests.delete(cor_id);
        }, 10000, correlationId);

        let entry = {
            timeout: timer,
            callback: next
        }

        this.requests.set(correlationId, entry);

        let payloads = [{
            topic: this.producer_topic,
            messages: JSON.stringify({
                correlationId: correlationId,
                data: content,
                response_topic: this.consumer_topic
            }),
            partition: 0
        }];
        console.log(`the payload to topic ${this.producer_topic} is`, payloads);
        this.producer.send(payloads, (err, data) => {
            if (err)
                console.log(err);
            console.log(`producer on topic ${this.producer_topic} has sent data and result is: `, data);
        });
    }
}