// src/apis/problemAdminApi.js (Corrected)

const axiosInstance = require("../config/axiosInstance");
const { PROBLEM_ADMIN_SERVICE_URL } = require("../config/serverConfig");
const InternalServerError = require("../errors/InternalServerError"); // Import a generic error

const PROBLEM_ADMIN_API_URL = `${PROBLEM_ADMIN_SERVICE_URL}/api/v1`;

async function fetchProblemDetails(problemId) {
  try {
    const uri = PROBLEM_ADMIN_API_URL + `/problems/${problemId}`;
    const response = await axiosInstance.get(uri);
    return response.data;
  } catch (error) {
    console.error("Error fetching problem details:", error.message);

    // Check if the error is from axios and has a response (like a 404)
    if (error.response) {
      // Re-throw a more specific error with details from the Problem-Service
      throw new InternalServerError(
        `Failed to fetch problem. Status: ${error.response.status} - ${error.response.statusText}`
      );
    }

    // For other errors (network issues, etc.), re-throw a generic error
    throw new InternalServerError(
      "Not able to fetch problem details at the moment."
    );
  }
}

module.exports = {
  fetchProblemDetails,
};
