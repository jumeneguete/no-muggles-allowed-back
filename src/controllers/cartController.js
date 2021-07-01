import connection from "../database/database.js"

async function getCartProducts (req,res) {

    const authorization = req.headers['authorization']
    const token = authorization?.replace('Bearer ', '')

    try {
        const validUser = await connection.query(`SELECT * FROM sessions
                                                  WHERE token = $1`, [token])
        if(!validUser.rows.length) return res.sendStatus(401)
    
        const productsSelected = await connection.query(`SELECT cart.*, products."productName", products.price, 
                                                            products."productImage", products.stock
                                                            FROM cart JOIN products 
                                                            ON products."SKU" = cart."SKU"
                                                            WHERE cart."userId" = $1`, 
                                                         [validUser.rows[0].userId])
        return res.send(productsSelected.rows).status(200)
    }
    catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

async function deleteItem (req,res) {
    const {itemSku} = req.body
    const authorization = req.headers['authorization']
    const token = authorization?.replace('Bearer ', '')

    try {
        const validUser = await connection.query(`SELECT * FROM sessions
                                                  WHERE token = $1`, [token])
        if(!validUser.rows.length) return res.sendStatus(401)

        await connection.query(`DELETE FROM cart WHERE "SKU" = $1`, [itemSku])
        const newCart = await connection.query(`SELECT * FROM cart WHERE "userId" = $1`, 
                                                [validUser.rows[0].userId])

        res.send(newCart).status(200)
    }
    catch (e){
        console.log(e)
        res.sendStatus(500)
    }
}

export {getCartProducts, deleteItem};