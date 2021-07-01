import { afterAll, beforeEach } from '@jest/globals'
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database/database.js';

async function cleanDatabase() {
    await connection.query('DELETE FROM "userData"');
    await connection.query('DELETE FROM payment');
    await connection.query('DELETE FROM sessions');
}

beforeEach(async () => {
    await connection.query('DELETE FROM sessions WHERE token = $1', ['test'])
})

afterAll(async () => {
    await connection.query('DELETE FROM sessions WHERE token = $1', ['test'])
    connection.end();
})

describe('GET /checkout', () => {
    beforeEach (async() => {
        await connection.query(`INSERT INTO sessions ("userId", token) 
                                VALUES ($1, $2)`, [100, 'test'])
    })

    it('returns 200 for valid params', async() => {
        const result = await supertest(app).get('/checkout').set('Authorization', 'Bearer test')
        const status = result.status
        expect(status).toEqual(200)
    })

    it('returns 401 for invalid token', async() => {
        const result = await supertest(app).get("/checkout").set('Authorization', 'Bearer wrongtoken');
        const status = result.status
        expect(status).toEqual(401)
    })
}) 

describe('POST /useraddress', () => {
    beforeEach (async() => {
        await connection.query(`INSERT INTO sessions ("userId", token) 
                                VALUES ($1, $2)`, [100, 'test'])
    })

    it('returns 201 for valid params', async() => {

        const body = {
            "titleAddress": "Teste",
            "address": "Rua Teste, n° 000, casa 1",
            "CPF": "15024230736"
        }
        
        const result = await supertest(app) .post("/useraddress")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')

        await connection.query(`DELETE FROM "userData" WHERE "titleAddress"=$1`, ["Teste"])

        expect(result.status).toEqual(201)
    })

    it('returns 401 for invalid token', async() => {
        const result = await supertest(app).post("/useraddress").set('Authorization', 'Bearer wrongtoken');
        expect(result.status).toEqual(401)
    })

    it('returns 422 for invalid title address', async() => {

        const body = {
            "titleAddress": 1234,
            "address": "Rua Teste, n° 000, casa 1",
            "CPF": "15024230736"
        }
        
        const result = await supertest(app) .post("/useraddress")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')

        expect(result.status).toEqual(422)
    })

    it('returns 422 for empty title address', async() => {

        const body = {
            "titleAddress": "",
            "address": "Rua Teste, n° 000, casa 1",
            "CPF": "15024230736"
        }
        
        const result = await supertest(app) .post("/useraddress")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')

        expect(result.status).toEqual(422)
    })

    it('returns 422 for invalid address', async() => {

        const body = {
            "titleAddress": "Teste",
            "address": 1234,
            "CPF": "15024230736"
        }
        
        const result = await supertest(app) .post("/useraddress")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')

        expect(result.status).toEqual(422)
    })

    it('returns 422 for empty address', async() => {

        const body = {
            "titleAddress": "Teste",
            "address": "",
            "CPF": "15024230736"
        }
        
        const result = await supertest(app) .post("/useraddress")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')

        expect(result.status).toEqual(422)
    })

    it('returns 422 for invalid CPF', async() => {

        const body = {
            "titleAddress": "Teste",
            "address": "Rua Teste, n° 000, casa 1",
            "CPF": "150242307367"
        }
        
        const result = await supertest(app) .post("/useraddress")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')

        expect(result.status).toEqual(422)
    })

    it('returns 422 for empty CPF', async() => {

        const body = {
            "titleAddress": "Teste",
            "address": "Rua Teste, n° 000, casa 1",
            "CPF": ""
        }
        
        const result = await supertest(app) .post("/useraddress")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')

        expect(result.status).toEqual(422)
    })
})

describe('POST /postcard', () => {
    beforeEach (async() => {
        await connection.query(`INSERT INTO sessions ("userId", token) 
                                VALUES ($1, $2)`, [100, 'test'])
    })

    it('returns 201 for valid params', async() => {

        const body = {
            "cardNumber": 1234123412341234,
            "cardName": "Teste",
            "validity": "2030-10-10"
        }
        const result = await supertest(app) .post("/savecard")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')
        
        await connection.query(`DELETE FROM "payment" WHERE "cardName"=$1`, ["Teste"])                                            

        expect(result.status).toEqual(201)
    })

    it('returns 401 for invalid token', async() => {

        const result = await supertest(app).post("/savecard").set('Authorization', 'Bearer wrongtoken');

        expect(result.status).toEqual(401)
    })

    it('returns 422 for invalid card number', async() => {
        const body = {
            "cardNumber": 12341234123412,
            "cardName": "Teste",
            "validity": "2030-10-10"
        }
        const result = await supertest(app) .post("/savecard")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')
        
        expect(result.status).toEqual(422)
    })

    it('returns 422 for invalid card number', async() => {
        const body = {
            "cardNumber": 123412341234123456,
            "cardName": "Teste",
            "validity": "2030-10-10"
        }
        const result = await supertest(app) .post("/savecard")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')
        
        expect(result.status).toEqual(422)
    })

    it('returns 422 for empty card number', async() => {
        const body = {
            "cardNumber": "",
            "cardName": "Teste",
            "validity": "2030-10-10"
        }
        const result = await supertest(app) .post("/savecard")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')
        
        expect(result.status).toEqual(422)
    })

    it('returns 422 for invalid card name', async() => {
        const body = {
            "cardNumber": 1234123412341234,
            "cardName": 1234,
            "validity": "2030-10-10"
        }
        const result = await supertest(app) .post("/savecard")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')
        
        expect(result.status).toEqual(422)
    })
    
    it('returns 422 for empty card name', async() => {
        const body = {
            "cardNumber": 1234123412341234,
            "cardName": "",
            "validity": "2030-10-10"
        }
        const result = await supertest(app) .post("/savecard")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')
        
        expect(result.status).toEqual(422)
    })

    it('returns 422 for invalid date', async() => {
        const body = {
            "cardNumber": 1234123412341234,
            "cardName": "Teste",
            "validity": "2020-13-10"
        }
        const result = await supertest(app) .post("/savecard")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')
        
        expect(result.status).toEqual(422)
    })

    it('returns 422 for empty date', async() => {
        const body = {
            "cardNumber": 1234123412341234,
            "cardName": "Teste",
            "validity": ""
        }
        const result = await supertest(app) .post("/savecard")
                                            .send(body)
                                            .set('Authorization', 'Bearer test')
        
        expect(result.status).toEqual(422)
    })
})