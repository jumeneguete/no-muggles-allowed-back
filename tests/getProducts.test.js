import supertest from "supertest";
import app from "../src/app.js"
import connection from "../src/database/database.js";

afterAll(()=> connection.end());

describe("GET /products", () => {
    it("returns status 200 for successful products request", async () => {

        await connection.query(`INSERT INTO products ("productName", description, price, stock, sku, "productImage")
                                VALUES ('productname', 'testdescription', 7000, 4, 0090, 'testimage')`);
     
        const result = await supertest(app).get("/products");
        expect(result.status).toEqual(200);
    });

    it("returns status 200 for products searched via query 'product'", async () => {

        await connection.query(`INSERT INTO products ("productName", description, price, stock, sku, "productImage")
                                VALUES ('productname', 'testdescription', 7000, 4, 0090, 'testimage')`);
        const result = await supertest(app).get("/products").query({product: 'pro'});
        expect(result.status).toEqual(200);
    });

    it("returns status 200 for products searched via empty query 'product'", async () => {

        await connection.query(`INSERT INTO products ("productName", description, price, stock, sku, "productImage")
                                VALUES ('productname', 'testdescription', 7000, 4, 0090, 'testimage')`);
        const result = await supertest(app).get("/products").query({product: ''});
        expect(result.status).toEqual(200);
    });
});