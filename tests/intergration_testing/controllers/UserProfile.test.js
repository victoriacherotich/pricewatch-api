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

    describe("User profile creation validation", () => {
        it("Should return 400 provided data doesnt meet requirement!", async () => {
            const user = {
                socket_auth_users_public_id: "1",
                socket_auth_user_first_name: "j",
                socket_auth_user_middle_name: "e",
                socket_auth_user_last_name: "e",
                socket_auth_user_country: "e",
                socket_auth_user_state: "e",
                socket_auth_user_precise_location: "rket",
                socket_auth_user_contact: "3",
              };
              const response = await request(server).post('/api/profile/v1').send(user);
              expect(response.status).toBe(400);
        });
    });

    describe("User profile update validation", () => {
        it("Should return 400 provided data doesnt meet requirement!", async () => {
            const id = 1111111111;
            const user = {
                socket_auth_user_first_name: "j",
                socket_auth_user_middle_name: "e",
                socket_auth_user_last_name: "e",
                socket_auth_user_country: "e",
                socket_auth_user_state: "e",
                socket_auth_user_precise_location: "rket",
                socket_auth_user_contact: "3",
              };
              const response = await request(server).patch('/api/profile/v1/'+ id).send(user);
              expect(response.status).toBe(400);
        });
    });

    describe("User profile creation", () => {
        it("Should return 200 if profile created succesfuly!", async () => {
            const user = {
                socket_auth_users_public_id: "1111111111",
                socket_auth_user_first_name: "joshua",
                socket_auth_user_middle_name: "isaac",
                socket_auth_user_last_name: "omwoyo",
                socket_auth_user_country: "Kenya",
                socket_auth_user_state: "Nairobi",
                socket_auth_user_precise_location: "Kenyatta market",
                socket_auth_user_contact: "25477039675",
              };
              const response = await request(server).post('/api/profile/v1').send(user);
              expect(response.status).toBe(200);
        });
    });

    describe("User profile update", () => {
        it("Should return 200 if profile updated succesfuly!", async () => {
            const id = 1111111111;
            const user = {
                socket_auth_user_first_name: "joshua",
                socket_auth_user_middle_name: "isaac",
                socket_auth_user_last_name: "omwoyo",
                socket_auth_user_country: "Kenya",
                socket_auth_user_state: "Nairobi",
                socket_auth_user_precise_location: "Kenyatta market",
                socket_auth_user_contact: "25477039675",
              };
              const response = await request(server).patch('/api/profile/v1/'+ id).send(user);
              expect(response.status).toBe(200);
        });
    });

});