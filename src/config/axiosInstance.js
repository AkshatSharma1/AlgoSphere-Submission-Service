const axios = require('axios');
const axiosRetry = require('axios-retry');

const axiosInstance = axios.create();

// Configure axios-retry
axiosRetry(axiosInstance, {
    retries: 3, // number of retries
    retryDelay: (retryCount) => {
        console.log(`Retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: (error) => {
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
});


module.exports = axiosInstance;