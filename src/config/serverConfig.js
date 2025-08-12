const dotenv = require('dotenv')

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    REDIS_PORT: process.env.REDIS_PORT || '6379',
    REDIS_HOST: process.env.REDDIS_HOST || '127.0.0.1',
    NODE_ENV: process.env.NODE_ENV,
    PROBLEM_ADMIN_SERVICE_URL : process.env.PROBLEM_ADMIN_SERVICE_URL,
    PROD_DB_URL : process.env.PROD_DB_URL
}