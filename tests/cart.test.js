import { afterAll, beforeEach } from '@jest/globals'
import supertest from 'supertest';
import app from '../src/app';
import connection from '../src/database/database';

beforeEach(async () => {
    await connection.query('DELETE FROM sessions WHERE token = $1', ['test'])
})

afterAll(async () => {
    await connection.query('DELETE FROM sessions WHERE token = $1', ['test'])
    connection.end();
})

describe("GET /cart", () => {
    it('returns 200 for valid params', async() => {
        
        await connection.query(`INSERT INTO sessions (userId, token) 
                                VALUES ($1, $2)`, [100, 'test'])

        const result = await supertest(app).get("/cart").set('Authorization', 'Bearer test');
        const status = result.status;
        
        expect(status).toEqual(200);
    })

    it('returns 401 for invalid token', async() => {

        await connection.query(`INSERT INTO sessions (userId, token) 
                                VALUES ($1, $2)`, [100, 'test'])
        const result = await supertest(app).get("/cart").set('Authorization', 'Bearer wrongtoken');
        const status = result.status

        expect(status).toEqual(401);
    })
})