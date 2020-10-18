const Joi = require('@hapi/joi');

const validateUser = user => {
    const schema = Joi.object().keys({
        socket_auth_username: Joi.string().min(5).required().label('Username'),
        socket_auth_useremail: Joi.string().email().required().label('Email'),
        socket_auth_userpassword: Joi.string().min(6).required().label('Password')
    });

    return schema.validate(user);
};

module.exports = validateUser;