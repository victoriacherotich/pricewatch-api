const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticate(request, response, next) {
    const token = request.header('jwtToken');
    if (!token) return response.status(401).send('Access denied');

    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        request.user = decoded;
        next();
    } catch (error) {
        response.status(400).send('Invalid token');
    }
} 

module.exports = authenticate;