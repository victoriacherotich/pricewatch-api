const pool = require('../database/ConnectionString');

const createUserTable = async () => {
    try { 
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                socket_auth_users_id SERIAL, 
                socket_auth_users_public_id VARCHAR(255) UNIQUE NOT NULL, 
                socket_auth_username VARCHAR(50) UNIQUE NOT NULL,
                socket_auth_useremail VARCHAR(100) UNIQUE NOT NULL, 
                socket_auth_userpassword TEXT NOT NULL,
                socket_auth_user_primary_privilages BOOLEAN DEFAULT FALSE NOT NULL, 
                socket_auth_user_secondary_privilages BOOLEAN DEFAULT FALSE NOT NULL,
                socket_auth_user_points INTEGER,
                socket_auth_user_password_reset_code VARCHAR(200) DEFAULT false,
                status BOOLEAN DEFAULT false,
                time_posted TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);
    } catch (error) {
        console.log(error);
    };
}
createUserTable();

module.exports = createUserTable;