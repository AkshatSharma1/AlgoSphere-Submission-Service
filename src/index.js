const fastify = require('fastify')({
    logger: true
})

const app = require('./app');
const connectToDB = require('./config/db.config');
const serverConfig = require('./config/serverConfig');
const { errorHandler } = require('./utils');

fastify.register(app);
fastify.setErrorHandler(errorHandler)

//run the server
fastify.listen({port: serverConfig.PORT, host: '0.0.0.0'}, async (err, address)=>{
    if(err){
        fastify.log.error(err);
        process.exit(1);
    }
    await connectToDB();
    console.log("Connected to db")
    // console.log(`Server is now listening on address, ${address}`);
})