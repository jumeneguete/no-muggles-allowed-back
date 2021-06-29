import connection from "../database/database.js"

async function getCartProducts (req,res) {

    const authorization = req.headers['authorization']
    const token = authorization?.replace('Bearer ', '')

    try {
        const validUser = await connection.query(`SELECT * FROM sessions
                                                  WHERE token = $1`, [token])
        if(!validUser.rows.length) return res.sendStatus(401)
    
        const productsSelected = await connection.query(`SElECT * FROM cart
                                                         WHERE userid = $1`, 
                                                         [validUser.userid])
        return res.send(productsSelected).status(200)
    }
    catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export default getCartProducts;