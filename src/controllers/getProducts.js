import connection from "../database/database.js";

async function getProducts(req, res) {
    const { product } = req.query;
    const searchedProduct = product ? `%_${product}%` : "";

    try {
        if (searchedProduct) {
            const filteredProduct = await connection.query('SELECT * FROM products WHERE "productName" ILIKE $1', [searchedProduct]);
            return res.status(200).send(filteredProduct.rows);
        }

        const result = await connection.query(`SELECT * FROM products`);
        return res.status(200).send(result.rows);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export default getProducts;
