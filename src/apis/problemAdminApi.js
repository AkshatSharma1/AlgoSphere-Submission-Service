
// const axiosInstance = require('../config/axiosInstance');
// const { PROBLEM_ADMIN_SERVICE_URL } = require('../config/serverConfig');

// const PROBLEM_ADMIN_API_URL = `${PROBLEM_ADMIN_SERVICE_URL}/api/v1`;

// async function fetchProblemDetails(problemId) {
//     try {
//         const uri = PROBLEM_ADMIN_API_URL + `/problems/${problemId}`;
//         const response = await axiosInstance.get(uri);
//         console.log("Api response: ", response.data);
//         return response.data;

//     } catch(error) {
//         console.log("Something went wrong while fetching problem details");
//         console.log(error);
//     }
// }

// module.exports = {
//     fetchProblemDetails
// }

const axiosInstance = require('../config/axiosInstance');
const { PROBLEM_ADMIN_SERVICE_URL } = require('../config/serverConfig');
const CircuitBreaker = require('opossum');

const PROBLEM_ADMIN_API_URL = `${PROBLEM_ADMIN_SERVICE_URL}/api/v1`;

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000 // After 30 seconds, try again.
};

const breaker = new CircuitBreaker(async (problemId) => {
    const uri = PROBLEM_ADMIN_API_URL + `/problems/${problemId}`;
    const response = await axiosInstance.get(uri);
    return response.data;
}, options);

async function fetchProblemDetails(problemId) {
    try {
        const response = await breaker.fire(problemId);
        return response;
    } catch(error) {
        console.error(`Error fetching problem details for ${problemId}:`, error);
        // We re-throw the error so the service layer can handle it
        throw error;
    }
}

// Optional: Listen to circuit breaker events for logging/monitoring
breaker.on('fallback', () => console.warn(`Circuit breaker fallback for Problem-Service.`));
breaker.on('open', () => console.error(`Circuit breaker opened for Problem-Service.`));
breaker.on('close', () => console.log(`Circuit breaker closed for Problem-Service.`));


module.exports = {
    fetchProblemDetails
}