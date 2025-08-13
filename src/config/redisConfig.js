// const Redis = require('ioredis');
// const serverConfig = require('./serverConfig')

// const redisConfig = {
//     port: serverConfig.REDIS_PORT,
//     host: serverConfig.REDIS_HOST,
//     maxRetriesPerRequest: null
// };

// const redisConnection = new Redis(redisConfig);

// module.exports = redisConnection;

// src/config/redisConfig.js
const Redis = require("ioredis");

// Render (or any other hosting service) provides the full Redis connection
// URL as a single environment variable. The ioredis library is smart
// enough to parse this URL and connect directly without needing a separate
// host, port, or password.

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error(
    "Redis connection URL not found in environment variables (REDIS_URL)."
  );
}

const redisConnection = new Redis(redisUrl);

module.exports = redisConnection;
