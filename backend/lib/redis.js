var Redis = require('ioredis');

var redis = new Redis({
    host: "quora-redis-node.tvi37g.ng.0001.usw2.cache.amazonaws.com",
    port: 6379,
});

//var redis = new Redis();

redis.on('ready', () => {
    console.log('redis is ready');
});

redis.on("error", err => {
    console.log("redis error: " + err);
});

module.exports = redis;
