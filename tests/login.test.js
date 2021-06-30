import supertest from 'supertest';
import app from '../src/app';
import connection from "../src/database/database.js"

async function cleanDatabase () {
    await connection.query('DELETE FROM users');
    await connection.query('DELETE FROM sessions');
}

beforeAll(cleanDatabase);

afterAll(async () => {
    await cleanDatabase();
    connection.end();
});

describe('POST /sign-up', () => {
    it('return status 201 for valid params', async () => {
        const body = {
            name: "teste",
            lastName: "teste" ,
            email: "teste@teste.com", 
            password:"123456", 
            passwordConfirmation:"123456"
        }

        const result = await supertest(app).post('/sign-up').send(body);

        expect(result.status).toEqual(201)
    });

    it('return status 400 for invalid params', async () => {
        const body = {
            name: "teste", 
            email: "teste@teste.com", 
        }

        const result = await supertest(app).post('/sign-up').send(body);

        expect(result.status).toEqual(400)
    });

    it('return status 409 for duplicated params', async () => {
        const body = {
            name: "teste", 
            lastName: "teste",
            email: "teste2@teste.com", 
            password:"123456", 
            passwordConfirmation:"123456"
        }

        await supertest(app).post('/sign-up').send(body);
        const result = await supertest(app).post('/sign-up').send(body);

        expect(result.status).toEqual(409)
    });
})

describe('POST /sign-in', () => {
    it('return status 200 for valid params', async () => {
        const body = {
            email: "teste@teste.com", 
            password:"123456", 
        }

        const result = await supertest(app).post('/sign-in').send(body);

        expect(result.status).toEqual(200)
    });

    it('return status 400 for invalid params', async () => {
        const body = {
            email: "teste", 
            password:"123456", 
        }

        const result = await supertest(app).post('/sign-in').send(body);

        expect(result.status).toEqual(400)
    });
})