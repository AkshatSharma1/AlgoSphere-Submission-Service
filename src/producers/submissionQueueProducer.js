//Adding jobs into the queue
const submissionQueue = require("../queues/submissionQueue")

module.exports = async function(payload){
    //add the job into a queue
    await submissionQueue.add("SubmissionJob", payload);
    console.log("Successfully added a new job");
    
}