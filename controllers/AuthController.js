const pool = require('../database/ConnectionString');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validateUserLogin = require('../validations/AuthenticationValidation');

class AuthController {

    static async AuthenticateUser(request, response) {
        const {error} = validateUserLogin(request.body);
        if (error) return response.status(400).json({message: error.details[0].message});

        const {socket_auth_useremail, socket_auth_userpassword} = request.body;
        const sqlQueryRequest = `SELECT * FROM users WHERE socket_auth_useremail='${socket_auth_useremail}'`;
        
        const user = await pool.query(sqlQueryRequest);
        
        if (user.rows.length === 0) return response.status(200).json({message: 'Invalid email or password'});

        const validPassword = await bcrypt.compare(socket_auth_userpassword, user.rows[0].socket_auth_userpassword);
        if (!validPassword) return response.status(200).json({message: 'Invalid email or password!'});

        const newPointBalance  = (user.rows[0].socket_auth_user_points + 1);
        const sqlUpdateRequest = `UPDATE users SET socket_auth_user_points=${newPointBalance} WHERE socket_auth_users_public_id='${user.rows[0].socket_auth_users_public_id}' `;
        await pool.query(sqlUpdateRequest);     
        
        const token = jwt.sign({
            socket_auth_users_public_id: user.rows[0].socket_auth_users_public_id, 
            socket_auth_user_primary_privilages: user.rows[0].socket_auth_user_primary_privilages, 
            socket_auth_useremail: user.rows[0].socket_auth_useremail
        }, process.env.PRIVATE_KEY);
        
        response.status(201).json({'jwtToken': token});
    };

    static async AuthenticateUserFacebook(request, response) {

        const {socket_auth_users_public_id, socket_auth_username, socket_auth_useremail} = request.body;
        const sqlQueryRequest = `SELECT * FROM users WHERE socket_auth_useremail='${socket_auth_useremail}'`;
        
        const user = await pool.query(sqlQueryRequest);
        
        if (user.rows.length === 0) {
            // {socket_auth_users_public_id, socket_auth_username, socket_auth_useremail}
            const sqlPostRequest = `INSERT INTO users(socket_auth_users_public_id, socket_auth_username, socket_auth_useremail, socket_auth_userpassword, socket_auth_user_primary_privilages) 
            VALUES('${socket_auth_users_public_id}', '${socket_auth_username}', '${socket_auth_useremail}', 'null', 'true')`;
            user = await pool.query(sqlPostRequest);

            const newPointBalance  = (user.rows[0].socket_auth_user_points + 1);
            const sqlUpdateRequest = `UPDATE users SET socket_auth_user_points=${newPointBalance} WHERE socket_auth_users_public_id='${user.rows[0].socket_auth_users_public_id}' `;
            await pool.query(sqlUpdateRequest);                
            
            const sqlNotificationPostRequest = `INSERT INTO user_notifications(socket_auth_public_id, notification_message) VALUES('${socket_auth_users_public_id}', 'A point has been added to your account')`;
            await pool.query(sqlNotificationPostRequest);

            const sqlUpdateRequestStatus = `UPDATE users SET status='${true}' WHERE socket_auth_users_public_id='${user.rows[0].socket_auth_users_public_id}' `;
            await pool.query(sqlUpdateRequestStatus); 
            
            const token = jwt.sign({
                socket_auth_users_public_id: user.rows[0].socket_auth_users_public_id, 
                socket_auth_user_primary_privilages: user.rows[0].socket_auth_user_primary_privilages, 
                socket_auth_useremail: user.rows[0].socket_auth_useremail
            }, process.env.PRIVATE_KEY);

            return response.status(201).json({'jwtToken': token});    
    
        }else{
            const newPointBalance  = (user.rows[0].socket_auth_user_points + 1);
            const sqlUpdateRequest = `UPDATE users SET socket_auth_user_points=${newPointBalance} WHERE socket_auth_users_public_id='${user.rows[0].socket_auth_users_public_id}' `;
            await pool.query(sqlUpdateRequest); 
            
            const sqlUpdateRequestStatus = `UPDATE users SET status='${true}' WHERE socket_auth_users_public_id='${user.rows[0].socket_auth_users_public_id}' `;
            await pool.query(sqlUpdateRequestStatus); 
            
            const token = jwt.sign({
                socket_auth_users_public_id: user.rows[0].socket_auth_users_public_id, 
                socket_auth_user_primary_privilages: user.rows[0].socket_auth_user_primary_privilages, 
                socket_auth_useremail: user.rows[0].socket_auth_useremail
            }, process.env.PRIVATE_KEY);
            return response.status(201).json({'jwtToken': token});      
        }

    };
    // logout
    static async LogoutStatus(request, response) {
        const socket_auth_users_public_id = request.params.id;

        const sqlUpdateRequestStatus = `UPDATE users SET status='${false}' WHERE socket_auth_users_public_id='${socket_auth_users_public_id}' `;
        await pool.query(sqlUpdateRequestStatus);

        return response.status(200).json({message: 'Logged out'});   
    }

};

module.exports = AuthController;