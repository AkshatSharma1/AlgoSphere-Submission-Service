// src/middlewares/auth.middleware.js

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/serverConfig');
const UnauthorizedError = require('../errors/unauthorized.error');

const authenticate = (req, res, next) => {
    // --- Start of Debugging ---
    console.log("DEBUG: Auth middleware triggered.");
    console.log("DEBUG: JWT_SECRET being used for verification:", JWT_SECRET); // Log the secret
    // --- End of Debugging ---

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new UnauthorizedError('No token provided or token is not Bearer type'));
    }

    const token = authHeader.split(' ')[1];
    // --- Start of Debugging ---
    console.log("DEBUG: Token received:", token); // Log the received token
    // --- End of Debugging ---

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // --- Start of Debugging ---
        console.error("DEBUG: JWT verification failed!", error.message); // Log the specific error from the jwt library
        // --- End of Debugging ---
        return next(new UnauthorizedError('Invalid or expired token'));
    }
};

module.exports = authenticate;