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
    });

    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 500));
    });

    describe("Auth middleware", () => {
        it("Should return 401 if no token is set", async () => {

        });
    });

});