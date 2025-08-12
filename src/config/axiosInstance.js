const axios = require("axios");
// Corrected import for axios-retry
// const { default: axiosRetry } = require("axios-retry");

const axiosInstance = axios.create();

// axiosRetry(axiosInstance, {
//   retries: 3, // number of retries
//   retryDelay: (retryCount) => {
//     console.log(`Retry attempt: ${retryCount}`);
//     return retryCount * 2000; // time interval between retries
//   },
//   retryCondition: (error) => {
//     // Retry only on network errors or 5xx status codes
//     return (
//       axiosRetry.isNetworkOrIdempotentRequestError(error) ||
//       error.response?.status >= 500
//     );
//   },
// });

module.exports = axiosInstance;
