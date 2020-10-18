require('../models/UserRegistration')();
const pool = require('../database/ConnectionString');
const validateUser = require('../validations/UserRegistrationValidation');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");

class UserController {
    
    static async createUser(request, response) {
        const {error} = validateUser(request.body);
        if (error) return response.status(200).json({message: error.details[0].message});

        const {socket_auth_username, socket_auth_useremail, socket_auth_userpassword} = request.body;
        
        const socket_auth_users_public_id = Math.floor(Date.now());
        const salt = await bcrypt.genSalt(10);
        const hashed_socket_auth_userpassword = await bcrypt.hash(socket_auth_userpassword, salt);
        
        const sqlFetchRequest = `SELECT * FROM users WHERE socket_auth_useremail='${socket_auth_useremail}'`;
        const sqlPostRequest = `INSERT INTO users(socket_auth_users_public_id, socket_auth_username, socket_auth_useremail, socket_auth_userpassword) 
        VALUES('${socket_auth_users_public_id}', '${socket_auth_username}', '${socket_auth_useremail}', '${hashed_socket_auth_userpassword}')`;
        

        
        
        let user = await pool.query(sqlFetchRequest);
        if(user.rowCount > 0) { 
            return response.status(200).json({message: 'Username or email already already taken'});
        };
        
        user = await pool.query(sqlPostRequest);

        const sqlPostRequestTwo = `INSERT INTO user_profile(socket_auth_users_public_id, socket_auth_user_first_name, socket_auth_user_middle_name, socket_auth_user_last_name, socket_auth_user_country, socket_auth_user_state, socket_auth_user_precise_location, socket_auth_user_contact)
        VALUES('${socket_auth_users_public_id}', 'anonymous', 'anonymous', 'anonymous', 'country', 'state', 'location', '1111111111')`;
        await pool.query(sqlPostRequestTwo);
        
        return response.status(200).json({ message: 'User account successfully created!', data: user});
    };

    static async createAdmin(request, response) {
        const {error} = validateUser(request.body);
        if (error) return response.status(200).json({message: error.details[0].message});

        const {socket_auth_username, socket_auth_useremail, socket_auth_userpassword} = request.body;
        
        const socket_auth_users_public_id = Math.floor(Date.now());
        const salt = await bcrypt.genSalt(10);
        const hashed_socket_auth_userpassword = await bcrypt.hash(socket_auth_userpassword, salt);
        
        const sqlFetchRequest = `SELECT * FROM users WHERE socket_auth_useremail='${socket_auth_useremail}'`;
        const sqlPostRequest = `INSERT INTO users(socket_auth_users_public_id, socket_auth_username, socket_auth_useremail, socket_auth_userpassword, socket_auth_user_primary_privilages) 
        VALUES('${socket_auth_users_public_id}', '${socket_auth_username}', '${socket_auth_useremail}', '${hashed_socket_auth_userpassword}', 'true')`;
        

        let user = await pool.query(sqlFetchRequest);
        if(user.rowCount > 0) { 
            return response.status(200).json({message: 'Username or email already already taken'});
        };

        user = await pool.query(sqlPostRequest);

        const sqlPostRequestTwo = `INSERT INTO user_profile(socket_auth_users_public_id, socket_auth_user_first_name, socket_auth_user_middle_name, socket_auth_user_last_name, socket_auth_user_country, socket_auth_user_state, socket_auth_user_precise_location, socket_auth_user_contact)
        VALUES('${socket_auth_users_public_id}', 'admin', 'admin', 'admin', 'country', 'state', 'location', '1111111111')`;
        await pool.query(sqlPostRequestTwo);

        return response.status(200).json({ message: 'Admin account successfully created!'});
    };


    static async getUserPrivilage(request, response) {
        const sqlFetchRequest = `SELECT * FROM users WHERE socket_auth_user_primary_privilages='true'`;
        
        const useradmin = await pool.query(sqlFetchRequest);
        if (useradmin.rowCount > 0) {
            return response.status(200).json(true);
        }else{
            return response.status(200).json(false);
        }
    }

    static async mailUS(request, response) {
        const {name, email, subject, message} = request.body;
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'priceWatchh@gmail.com',
              pass: '5094@Vic'
            }
          });
          
          var mailOptions = {
            from: 'pricewatchh@gmail.com',
            to: 'myfriend@gmail.com',
            subject: subject,
            text: message
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return response.status(200).json({ message: 'Error sending mail'});
            } else {
                return response.status(200).json({ message: 'Mail sent'});
            }
          });
        
        
    }

    static async getAllUsers(request, response) {
        const sqlFetchRequest = `SELECT * FROM users LEFT JOIN user_profile ON users.socket_auth_users_public_id=user_profile.socket_auth_users_public_id WHERE socket_auth_user_primary_privilages!='true'`;
        
        const allusers = await pool.query(sqlFetchRequest);
        console.log(allusers.rows)
        return response.status(200).json(allusers.rows);
    }

    static async getallNotifications(request, response) {
        const socket_auth_public_id =request.params.id;

        const sqlFetchRequest = `SELECT * FROM user_notifications WHERE socket_auth_public_id='${socket_auth_public_id}' AND mark_as_read='false'`;
        
        const allNotifications = await pool.query(sqlFetchRequest);
        return response.status(200).json(allNotifications.rows);
    }

    static async updateSingleNotifications(request, response) {
        const notifications_id =request.params.id;
        
        const sqlUpdateRequest = `UPDATE user_notifications SET mark_as_read='true' 
        WHERE notifications_id='${notifications_id}'`;

        await pool.query(sqlUpdateRequest);
        return response.status(200).json({ message: 'Notification marked as read'});
    }

    static async updateAllNotifications(request, response) {
        const socket_auth_public_id =request.params.id;
        
        const sqlUpdateRequest = `UPDATE user_notifications SET mark_as_read='true' 
        WHERE socket_auth_public_id='${socket_auth_public_id}'`;

        await pool.query(sqlUpdateRequest);
        return response.status(200).json({ message: 'Notifications marked as read'});
    }

    static async updateUserPassword(request, response) {
        const socket_auth_users_public_id = request.params.id;

        const {socket_auth_userpassword } = request.body;

        const salt = await bcrypt.genSalt(10);
        const hashed_socket_auth_userpassword = await bcrypt.hash(socket_auth_userpassword, salt);
        
        const sqlUpdateRequest = `UPDATE users SET socket_auth_userpassword='${hashed_socket_auth_userpassword}'  WHERE socket_auth_users_public_id='${socket_auth_users_public_id}'`;
        await pool.query(sqlUpdateRequest);
        return response.status(200).json({ message: 'password updated successfully'});
    }  
    static async userCount(request, response) {
        const socket_auth_users_public_id = request.params.id;
        const allusers = await pool.query(`SELECT * FROM products WHERE socket_auth_users_public_id='${socket_auth_users_public_id}' `);
      return response.status(200).json(allusers.rowCount);
    }
    static async sendUserPasswordResetCode(request, response) {
        // const {socket_auth_useremail} = request.body;
        // const socket_auth_user_password_reset_code = Date.now();

        // const api_key='02db5f68af84dd2e23858c8efd32f027-059e099e-256f1c68'
        // const DOMAIN='https://api.mailgun.net/v3/sandbox0db790d19074407ba419b4b0b4f6a8c8.mailgun.org'
        // const mg = mailgun({apiKey: api_key, domain: DOMAIN});
        // const data = {
        //     from: 'Excited User <me@samples.mailgun.org>',
        //     // to: 'bar@example.com, YOU@YOUR_DOMAIN_NAME',
        //     to: request.body.socket_auth_useremail,
        //     // subject: 'Hello',
        //     subject: 'Hyreads Password reset code',
        //     // text: 'Testing some Mailgun awesomness!',
        //     text: `Password reset code is ${socket_auth_user_password_reset_code}`            
        // };
        // mg.messages().send(data, function (error, body) {
        //     console.log(body);
        // });



        const {socket_auth_useremail} = request.body;
        const socket_auth_user_password_reset_code = Date.now();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.MAILING_USER,
              pass: process.env.MAILING_PASSWORD
            }
          });

          
          const mailOptions = {
            from: process.env.MAILING_USER,
            to: request.body.socket_auth_useremail,
            subject: 'Hyreads Password reset code',
            text: `Password reset code is ${socket_auth_user_password_reset_code}`
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return response.status(200).json({ message: 'Error sending mail'});
            } else {
                return response.status(200).json({ message: 'Mail sent'});
            }
          });
        //   https://myaccount.google.com/lesssecureapps
        const sqlFetchRequest = `SELECT * FROM users WHERE socket_auth_useremail='${request.body.socket_auth_useremail}'`;
        const user = await pool.query(sqlFetchRequest);   
        if (user.rowCount === 1) {
            transporter.sendMail(mailOptions, async(error, info) => {
                if (error) {
                } else {
                    const sqlUpdateRequest = `UPDATE users SET socket_auth_user_password_reset_code='${socket_auth_user_password_reset_code}' WHERE socket_auth_useremail='${socket_auth_useremail}'`;

                    const postrequestresponse =await pool.query(sqlUpdateRequest);
                    if (postrequestresponse.rowCount === 1) {
                        return response.status(200).json({ message: 'Email sent successfuly'});
                    }else{
                        return response.status(200).json({ message: 'Sorry please try again' });
                    };
                }
            });
        }else{
            return response.status(200).json({ message: 'Sorry no associated account found' });
        };
    } 

    static async successPasswordReset(request, response) {
        const {socket_auth_user_password_reset_code, socket_auth_userpassword} = request.body;

        const sqlFetchRequest = `SELECT * FROM users WHERE socket_auth_user_password_reset_code='${request.body.socket_auth_user_password_reset_code}'`;

        let user = await pool.query(sqlFetchRequest);

        if(user.rowCount > 0) { 
            const salt = await bcrypt.genSalt(10);
            const hashed_socket_auth_userpassword = await bcrypt.hash(socket_auth_userpassword, salt);
            
            const sqlUpdateRequest = `UPDATE users SET socket_auth_userpassword='${hashed_socket_auth_userpassword}'  WHERE socket_auth_user_password_reset_code='${socket_auth_user_password_reset_code}'`;
            await pool.query(sqlUpdateRequest);
            return response.status(200).json({ message: 'password updated successfully'});
        }else{
            return response.status(200).json({ message: 'Sorry can not change password. Resend reset code' });
        }
    };
};

module.exports = UserController;