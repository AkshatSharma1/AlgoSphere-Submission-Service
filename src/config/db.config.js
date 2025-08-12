const mongoose = require("mongoose");
const { NODE_ENV, PROD_DB_URL } = require("./serverConfig");

async function connectToDB() {
    try {
        if(NODE_ENV === "development"){
            await mongoose.connect(PROD_DB_URL);
        }
    } catch (error) {
        console.log("Unable to connect to DB");
        console.log(error);
    }
}

module.exports = connectToDB;