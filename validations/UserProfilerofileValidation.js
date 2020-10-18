const Joi = require('@hapi/joi');

const validateUserProfile = user => {
    const schema = Joi.object().keys({
        socket_auth_users_public_id: Joi.string().min(10).required().label('Public id'),
        socket_auth_user_first_name: Joi.string().required().label('First name'),
        
        socket_auth_user_last_name: Joi.string().required().label('Last name'),
        socket_auth_user_country: Joi.string().required().label('Country'),
        socket_auth_user_state: Joi.string().required().label('State'),
        socket_auth_user_precise_location: Joi.string().required().label('Location'),
        socket_auth_user_contact: Joi.string().min(10).required().label('Contact')
    });

    return  schema.validate(user);
};

const validateUserProfileUpdate = user => {
    const schema = Joi.object().keys({
        socket_auth_user_first_name: Joi.string().required().label('First name'),
      
        socket_auth_user_last_name: Joi.string().required().label('Last name'),
        socket_auth_user_country: Joi.string().required().label('Country'),
        socket_auth_user_state: Joi.string().required().label('State'),
        socket_auth_user_precise_location: Joi.string().required().label('Location'),
        socket_auth_user_contact: Joi.string().min(10).required().label('Contact')
    });

    return  schema.validate(user);
};

module.exports = {validateUserProfile, validateUserProfileUpdate};