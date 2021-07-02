import supertest from "supertest";
import app from "../src/app.js"
import connection from "../src/database/database.js";

async function cleanDatabase () {
    await connection.query('DELETE FROM sessions WHERE token = $1', ['test']);
    await connection.query('DELETE FROM cart');
}

beforeAll(cleanDatabase);

afterAll(async () => {
    await cleanDatabase();
    connection.end();
});

describe("POST /cart", () => {
    it("returns status 200 when received valid values from body", async () => {

        await connection.query(`INSERT INTO sessions ("userId", token) 
                                VALUES ($1, $2)`, [100, 'test'])

        await connection.query(`
        INSERT INTO products ("productName", description, price, stock, sku, "productImage") VALUES
        (
            'AllStar Hermione', 
            'AllStart vermelho que a hermione',
            150, 
            4,
            999,
            'https://static.rockcity.com.br/public/rockcity/imagens/produtos/d67129fb546c9e5ef21c53c0be157cbf.jpg'
        )
    `);
    const body = {
        "sku": "999",
        "quantity": "2" ,
    }
     
        const result = await supertest(app).post("/cart").set('Authorization', 'Bearer test').send(body);
        expect(result.status).toEqual(200);
    });

    it("returns status 400 when received invalid values from body", async () => {

        await connection.query(`INSERT INTO sessions ("userId", token) 
                                VALUES ($1, $2)`, [100, 'test'])
                                console.log("rodou ate aqui")

        await connection.query(`
        INSERT INTO products ("productName", description, price, stock, sku, "productImage") VALUES
        (
            'AllStar Hermione', 
            'AllStart vermelho que a hermione',
            150, 
            4,
            999,
            'https://static.rockcity.com.br/public/rockcity/imagens/produtos/d67129fb546c9e5ef21c53c0be157cbf.jpg'
        )
    `);
    const body = {
        "sku": "hahaha",
        "quantity": "2" ,
    }
     
        const result = await supertest(app).post("/cart").set('Authorization', 'Bearer test').send(body);
        expect(result.status).toEqual(400);
    });

    it("returns status 409 for duplicated products", async () => {

        await connection.query(`INSERT INTO sessions ("userId", token) 
                                VALUES ($1, $2)`, [100, 'test'])
                                console.log("rodou ate aqui")

        await connection.query(`
        INSERT INTO products ("productName", description, price, stock, sku, "productImage") VALUES
        (
            'AllStar Hermione', 
            'AllStart vermelho que a hermione',
            150, 
            4,
            999,
            'https://static.rockcity.com.br/public/rockcity/imagens/produtos/d67129fb546c9e5ef21c53c0be157cbf.jpg'
        )
    `);
    const body = {
        "sku": "999",
        "quantity": "2" ,
    }
     
        await supertest(app).post("/cart").set('Authorization', 'Bearer test').send(body);
      
        const result = await supertest(app).post("/cart").set('Authorization', 'Bearer test').send(body);
        expect(result.status).toEqual(409);
    });
});