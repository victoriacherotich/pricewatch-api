const pool = require('../database/ConnectionString');

const createUserProfileTable = async () => {
    try { 
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_profile(
                user_profile_id SERIAL,
                socket_auth_users_public_id VARCHAR(255) NOT NULL,
                socket_auth_user_first_name VARCHAR(50) NOT NULL,
                socket_auth_user_middle_name VARCHAR(50) NOT NULL,
                socket_auth_user_last_name VARCHAR(50) NOT NULL,
                socket_auth_user_country VARCHAR(255) NOT NULL,
                socket_auth_user_state VARCHAR(255) NOT NULL,
                socket_auth_user_precise_location VARCHAR(255) NOT NULL,
                socket_auth_user_contact VARCHAR(15) NOT NULL,
                socket_auth_user_file TEXT DEFAULT 'uploads/profileimages/noimage.jpg',
                socket_auth_user_paypal_email TEXT,
                time_profile_posted TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (error) {
        console.log(error);
    };
}
createUserProfileTable();

module.exports = createUserProfileTable; 