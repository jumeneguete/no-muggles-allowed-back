import connection from "../database/database.js";
import insertCartSchema from "../schemas/insertCartSchema.js";

async function postCart(req, res) {
    const authorization = req.header("authorization");
    const token = authorization?.replace("Bearer ", "");
    const { sku, quantity } = req.body;

    const validBody = insertCartSchema.validate({ sku: parseInt(sku), quantity: parseInt(quantity)});

    if(validBody.error) return res.sendStatus(400);

    try {
        const result = await connection.query(`
        SELECT * FROM sessions WHERE token = $1`, [token]);

        const userId = result.rows[0].userId;

        const alreadyAdded = await connection.query(`SELECT * FROM cart where "userId"= $1 AND sku= $2`, [userId, sku]);
        if (alreadyAdded.rows.length > 0) return res.sendStatus(409);

        await connection.query(`INSERT INTO cart ("userId", sku, quantity) VALUES ($1, $2, $3)`, [userId, sku, quantity]);
       
        res.sendStatus(200);

    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

export default postCart;