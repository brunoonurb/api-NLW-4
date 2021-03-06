import request from 'supertest'
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database'

describe("Users", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    })

    afterAll(async () => {
      const connection = getConnection();
      await connection.dropDatabase();
      await connection.close();
    });

    it("should be able to create new user", async () => {
        const response = await request(app).post('/users')
            .send({
                email: 'user@examp.com',
                name: 'User Example'
            });
        expect(response.status).toBe(201);
    })

    it("should not be able to create new user with email", async () => {
        const response = await request(app).post('/users')
            .send({
                email: 'user@examp.com',
                name: 'User Example'
            });
        expect(response.status).toBe(400);
    })

});



    // it("Deve ser possicel somar 2 numero", ()=>{
    //     expect(2 + 2).toBe(4);
    // })

    // it("Deve ser possicel somar 2 numero", ()=>{
    //     expect(2 + 2).not.toBe(5);
    // })
