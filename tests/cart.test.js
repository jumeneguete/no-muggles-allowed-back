import { afterAll, beforeEach } from '@jest/globals'
import supertest from 'supertest';
import app from '../src/app';
import connection from '../src/database/database.js';

beforeEach(async () => {
    await connection.query('DELETE FROM sessions WHERE token = $1', ['carttest'])
})

afterAll(async () => {
    await connection.query('DELETE FROM sessions WHERE token = $1', ['carttest'])
    await connection.end();
})

describe("GET /cart", () => {

    beforeEach(async() => {
        await connection.query(`INSERT INTO sessions ("userId", token) 
                                VALUES ($1, $2)`, [200, 'carttest'])
    })

    it('returns 200 for valid params', async() => {

        const result = await supertest(app).get("/cart").set('Authorization', 'Bearer carttest');
        const status = result.status;
        
        expect(status).toEqual(200);
    })

    it('returns 401 for invalid token', async() => {

        const result = await supertest(app).get("/cart").set('Authorization', 'Bearer wrongtoken');
        const status = result.status

        expect(status).toEqual(401);
    })
})

describe("POST /delete-item", () => {
    beforeEach(async() => {
        await connection.query(`INSERT INTO sessions ("userId", token) 
                                VALUES ($1, $2)`, [200, 'carttest'])
    })

    it('returns 201 for valid params', async() => {

        const insert = await connection.query(`INSERT INTO cart ("userId", sku, quantity)
                                                VALUES ($1, $2, $3)`, [200, 500, 1])
                                       
        const body = {"sku": "500"}
        const result = await supertest(app) .post("/delete-item")
                                            .send(body)
                                            .set('Authorization', 'Bearer carttest')
        expect(result.status).toEqual(200)
    })

    it('returns 401 for invalid token', async() => {

        const result = await supertest(app).post("/delete-item").set('Authorization', 'Bearer wrongtoken');
        const status = result.status

        expect(status).toEqual(401);
    })
})