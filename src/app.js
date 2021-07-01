import express from 'express';
import cors from 'cors';
import getProducts from './controllers/getProducts.js';
import connection from './database/database.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', getProducts);

app.get('/cart', async (req, res) => {
    const result = await connection.query(`SELECT * FROM cart`);
    res.send(result.rows).status(200);
})

export default app;