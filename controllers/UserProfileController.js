require('../models/UserProfile')();
const pool = require('../database/ConnectionString');
const {validateUserProfile, validateUserProfileUpdate} = require('../validations/UserProfilerofileValidation');

class UserProfileController {

    static async createUserProfile(request, response) {
        const {error} = validateUserProfile(request.body);
        if (error) return response.status(400).json({message: error.details[0].message});

        const {socket_auth_users_public_id, socket_auth_user_first_name, socket_auth_user_middle_name, socket_auth_user_last_name, socket_auth_user_country, socket_auth_user_state, socket_auth_user_precise_location, socket_auth_user_contact} = request.body;

        const sqlPostRequest = `INSERT INTO user_profile(socket_auth_users_public_id, socket_auth_user_first_name, socket_auth_user_middle_name, socket_auth_user_last_name, socket_auth_user_country, socket_auth_user_state, socket_auth_user_precise_location, socket_auth_user_contact)
         VALUES('${socket_auth_users_public_id}', '${socket_auth_user_first_name}', '${socket_auth_user_middle_name}', '${socket_auth_user_last_name}', '${socket_auth_user_country}', '${socket_auth_user_state}', '${socket_auth_user_precise_location}', '${socket_auth_user_contact}')`;
    
        const postResponse = await pool.query(sqlPostRequest);
        if (postResponse.rowCount == 0) {
            return response.status(400).json({ message: 'Request unsuccessful. Save failed' });
        }else{
            return response.status(200).json({ message: 'Profile created successfully!'});
        };
    };

    static async updateUserProfile(request, response) {
        const {error} = validateUserProfileUpdate(request.body);
        if (error) return response.status(400).json({message: error.details[0].message});
        
        const socket_auth_users_public_id = request.params.id;
        const {socket_auth_user_first_name, socket_auth_user_middle_name, socket_auth_user_last_name, socket_auth_user_country, socket_auth_user_state, socket_auth_user_precise_location, socket_auth_user_contact} = request.body;

        const updateRequest = await pool.query(`UPDATE user_profile SET socket_auth_user_first_name=$1, socket_auth_user_middle_name=$2, socket_auth_user_last_name=$3, socket_auth_user_country=$4, socket_auth_user_state=$5, socket_auth_user_precise_location=$6, socket_auth_user_contact=$7 
        WHERE socket_auth_users_public_id='${socket_auth_users_public_id}'`, [socket_auth_user_first_name, socket_auth_user_middle_name, socket_auth_user_last_name, socket_auth_user_country, socket_auth_user_state, socket_auth_user_precise_location, socket_auth_user_contact]);
        
        if (updateRequest.rowCount == 0) {
            return response.status(400).json({ message: 'Request unsuccessful. Update failed' });
        }else{
            return response.status(200).json({ message: 'Profile updated successfully'});
        };
    };

    static async updateUserProfileImage(request, response) {
        const socket_auth_users_public_id = request.params.id;
        const socket_auth_user_file = request.file.path;

        const sqlUpdateRequest = `UPDATE user_profile SET  socket_auth_user_file='${socket_auth_user_file}' WHERE socket_auth_users_public_id='${socket_auth_users_public_id}' `;
        
        await pool.query(sqlUpdateRequest);
        return response.status(201).json({ message: 'Uploaded' });
    };

   
    
    static async getUserProfile(request, response) {
        const socket_auth_users_public_id = request.params.id;
        const sqlFetchRequest = `SELECT * FROM user_profile JOIN users ON user_profile.socket_auth_users_public_id=users.socket_auth_users_public_id WHERE user_profile.socket_auth_users_public_id='${socket_auth_users_public_id}'`;
        
        const profile = await pool.query(sqlFetchRequest);
        return response.status(200).json(profile.rows);
    }

    static async updateUserPaypalEmailProfile(request, response) {
        const socket_auth_users_public_id = request.params.id;

        const {socket_auth_user_paypal_email } = request.body;
        const sqlUpdateRequest = `UPDATE user_profile SET socket_auth_user_paypal_email='${socket_auth_user_paypal_email}'  WHERE socket_auth_users_public_id='${socket_auth_users_public_id}'`;

        await pool.query(sqlUpdateRequest);
        return response.status(200).json({ message: 'Paypal email updated successfully'});
    }   

}; 

module.exports = UserProfileController;