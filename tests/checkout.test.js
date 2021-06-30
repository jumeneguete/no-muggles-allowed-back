import { afterAll, beforeEach } from '@jest/globals'
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';

beforeEach(async () => {
    await connection.query('DELETE FROM sessions WHERE token = $1', ['test'])
})

afterAll(async () => {
    await connection.query('DELETE FROM sessions WHERE token = $1', ['test'])
    connection.end();
})

describe('GET /checkout', () => {
    it('returns 200 for valid params', async() => {

        await connection.query(`INSERT INTO sessions (userId, token) 
                                VALUES ($1, $2)`, [100, 'test'])
        
        const result = await supertest(app).get('/checkout').set('Authorization', 'Bearer test')
        const status = result.status

        expect(status).toEqual(200)
    })

    it('returns 401 for invalid token', async() => {

        await connection.query(`INSERT INTO sessions (userId, token) 
                                VALUES ($1, $2)`, [100, 'test'])
        const result = await supertest(app).get("/checkout").set('Authorization', 'Bearer wrongtoken');
        const status = result.status

        expect(status).toEqual(401)
    })
}) 

describe('POST /useraddress', () => {
    it('returns 201 for valid params', async() => {

        await connection.query(`INSERT INTO sessions (userId, token) 
                                VALUES ($1, $2)`, [100, 'test'])

        const body = {
            "titleAddress": "Casa de teste",
            "address": "Rua Teste, n° 000, casa 1",
            "cpf": "150.242.307-36"
        }
        
        const result = await supertest(app) .post("/useraddress")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')
        const status = result.status

        expect(status).toEqual(200)
    })

    it('returns 401 for invalid token', async() => {

        await connection.query(`INSERT INTO sessions (userId, token) 
                                VALUES ($1, $2)`, [100, 'test'])
        const result = await supertest(app).get("/checkout").set('Authorization', 'Bearer wrongtoken');
        const status = result.status

        expect(status).toEqual(401)
    })
}) 