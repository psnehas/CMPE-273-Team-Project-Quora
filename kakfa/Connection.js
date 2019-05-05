var kafka = require('kafka-node')
const kafkaHost = '172.31.18.174:9092'
// const kafkaHost = 'localhost:9092'

module.exports = class KafkaConnection {
    constructor(producer_topic, consumer_topic) {
        this.producer_topic = producer_topic;
        this.consumer_topic = consumer_topic;
        this.producer = null;
        this.consumer = null;
    }

    getConsumer() {
        console.log(`[KafkaConnection getConsumer] with consumer_topic ${this.consumer_topic}`);
        if (!this.consumer) {
            this.consuemrClient = new kafka.KafkaClient({kafkaHost: kafkaHost});
            console.log(`[KafkaConnection getConsumer] create a consumer`);
            this.consumer = new kafka.Consumer(this.consuemrClient, [{topic: this.consumer_topic, partition: 0}]);
            this.consuemrClient.on('ready', () => {
                console.log(`consumer on topic ${this.consumer_topic} is ready`);
            })
        }
        return this.consumer;
    }

    getProducer() {
        console.log(`[KafkaConnection getProducer] with producer_topic ${this.producer_topic}`);
        if (!this.producer) {
            this.producerClient = new kafka.KafkaClient({kafkaHost: kafkaHost});
            console.log(`[KafkaConnection getProducer] create a producer`);
            this.producer = new kafka.HighLevelProducer(this.producerClient);
            this.producerClient.on('ready', () => {
                console.log(`producer on topic ${this.producer_topic} is ready`);
            })
        }
        return this.producer;
    }
}
