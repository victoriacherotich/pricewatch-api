const request = require("supertest");
const pool = require("../../../database/ConnectionString");

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
                socket_auth_username: "1",
                socket_auth_useremail: "jayson@gmail.com",
                socket_auth_userpassword: "Joshua isaac"
              };
              const response = await request(server).post('/api/registration/v1').send(user);
              expect(response.status).toBe(400);
        });
    });
    describe("User exists", () => {
        it("Should return 400 if user exists", async () => {
            const sqlPostRequest = `INSERT INTO users (socket_auth_users_public_id, socket_auth_username, socket_auth_useremail, socket_auth_userpassword)
            VALUES('1111111111', 'jayisaaco', 'jayisaac0@gmail.com', 'joshuaisaac')`;
            await pool.query(sqlPostRequest);

            const user = {
                socket_auth_users_public_id: 1111111111,
                socket_auth_username: "jayisaaco",
                socket_auth_useremail: "jayisaac0@gmail.com",
                socket_auth_userpassword: "joshuaisaac",
            };
            const response = await request(server).get('/api/registration/v1');
            if(user.rowCount > 0) { 
                expect(response.status).toBe(400);
            };
        });
    });
    describe("User created", () => {
        it("Should return 200 if new user is created", async () => {
            const user = {
              socket_auth_username: "Josshuaz",
              socket_auth_useremail: "jayson@gmail.com",
              socket_auth_userpassword: "Joshua isaac"
            };
            const response = await request(server).post('/api/registration/v1').send(user);
            expect(response.status).toBe(200);
        });
    });

});
