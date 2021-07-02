import supertest from "supertest";
import app from "../src/app.js"
import connection from "../src/database/database.js";
import { v4 as uuidv4 } from 'uuid';

afterAll(()=> connection.end());

describe("POST /cart", () => {
    it("returns status 200 when received valid values from body", async () => {

        const register = await connection.query(`
        INSERT INTO users (name, lastname, email, password) 
        VALUES ('teste', 'teste', 'teste@teste.com', 'teste') RETURNING *`);

        const userId = register.rows[0].id ;

        const token = uuidv4();

        await connection.query(`
        INSERT INTO sessions 
        ("userId", token)
        VALUES (${userId}, ${token})
        RETURNING * `);


        await connection.query(`INSERT INTO products ("productName", description, price, stock, sku, "productImage")VALUES ('productname', 'testdescription', 7000, 4, 999, 'testimage')`);
        const body = {
            sku: "999",
            quantity: "2"
        }

        const result = await supertest(app).post("/cart").send(body).set('Authorization', `Bearer ${token}`);
        expect(result.status).toEqual(200);
    });

});