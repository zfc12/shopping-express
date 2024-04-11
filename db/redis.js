const redis = require('redis');
const { REDIS_CONF } = require('../config/db');

const redisClient = redis.createClient({
    url: `redis://${REDIS_CONF.host}:${REDIS_CONF.port}`,
    legacyMode: true
});

// 连接
redisClient.connect()
.then(() => {console.log('redis connect success')})
.catch((error) => console.error(error));

module.exports = redisClient