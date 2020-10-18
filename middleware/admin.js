const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');

function admin(request, response, next) {
    if (!request.user.socket_auth_user_primary_privilages) return response.status(403).send('FORBIDEN: Access denied');
    next();
}

module.exports = admin;   