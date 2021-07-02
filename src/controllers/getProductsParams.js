import connection from "../database/database.js";

async function getProductsParams(req, res) {
    const id = parseInt(req.params.id);

    try {
        if (!id) return res.sendStatus(400);
        const product = await connection.query(`SELECT * FROM products WHERE id = $1`, [id]);

        if(product.rows.length === 0) return res.sendStatus(404);

        return res.status(200).send(product.rows[0]);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export default getProductsParams;