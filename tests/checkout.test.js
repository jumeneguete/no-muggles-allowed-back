import { afterAll, beforeEach } from '@jest/globals'
import supertest from 'supertest';
import app from '../src/app';
import connection from '../src/database/database';

beforeEach(async () => {
    await connection.query('DELETE FROM cart, userdata, adress WHERE userId = $1', [userData])
})

afterAll(async () => {
    await connection.query('DELETE FROM sessions WHERE token = $1', ['test'])
    connection.end();
})

describe('GET /checkout', () => {
    it('returns 201 for valid params', async() => {

        
    })
}) 