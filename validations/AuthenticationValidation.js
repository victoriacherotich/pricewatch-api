const Joi = require('@hapi/joi');

const validateUserLogin = user => {
    const schema = Joi.object().keys({
        socket_auth_useremail: Joi.string().min(5).required().email().label('Email'),
        socket_auth_userpassword: Joi.string().min(8).required().label('Password')
    });
    
    return schema.validate(user);
};

module.exports = validateUserLogin;