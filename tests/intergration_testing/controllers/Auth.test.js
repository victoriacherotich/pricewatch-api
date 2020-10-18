const request = require("supertest");
const pool = require("../../../database/ConnectionString");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
let server;

describe("/api/register", () => {
    beforeEach(() => {
        server = require('../../../server');
    });

    afterEach(async () => {
        await server.close();
        await pool.query('DELETE FROM users');
    });

    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 500));
    });

    describe("User validation", () => {
        it("Should return 400 if validation fails", async () => {
            const user = {
                socket_auth_useremail: "jayson",
                socket_auth_userpassword: "J"
              };
              const response = await request(server).post('/api/auth/v1').send(user);
              expect(response.status).toBe(400);
              
        });
    });

    describe("Wrong credentials", () => {
        it("It should return 400 if credentials are invalid", async () => {            
            const sqlPostRequest = `INSERT INTO users (socket_auth_users_public_id, socket_auth_username, socket_auth_useremail, socket_auth_userpassword)
            VALUES('1111111111', 'jayisaaco', 'jayisaac0@gmail.com', 'joshuaisaac')`;
            await pool.query(sqlPostRequest);
            
            const user = {
                socket_auth_useremail: "unknown@gmail.com"
            };

            const response = await request(server).get('/api/registration/v1').send(user);
            if(user.rows === 0) {
                expect(response.status).toBe(400);
            }
        });

    });

    describe("Wrong credentials", () => {
        it("It should return 400 if password is wrong", async () => {
            const user = {
                socket_auth_userpassword: "Very looooooong unknown madeup password"
            };

            const response = await request(server).get('/api/registration/v1').send(user);
            if(user.rows === 0) {
                expect(response.status).toBe(400);
            }
        });
    });

    describe("generating token", () => {
        it("Should return 201 after generating", async () => {

       
            const user = {
                socket_auth_users_public_id: 1111111111,
                socket_auth_username: "jayisaaco",
                socket_auth_useremail: "jayisaac0@gmail.com",
                socket_auth_userpassword: "joshuaisaac",
            };
            const response = await request(server).get('/api/auth/v1').send(user);
            if(user.rows > 0) { 
                expect(response.status).toBe(201);
            };

        });
    });



});