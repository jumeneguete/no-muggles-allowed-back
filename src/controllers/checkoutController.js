import connection from "../database/database.js"
import { addressSchema, cardSchema } from "../schemas/checkoutSchema.js"

async function getUsers (req,res) {
    const authorization = req.headers['authorization']
    const token = authorization?.replace('Bearer ', '')

    try {
        const validUser = await connection.query(`SELECT * FROM sessions
                                                  WHERE token = $1`, [token])
        if(!validUser.rows.length) return res.sendStatus(401)
        
        const userId = validUser.rows[0].userId

        const userData = await connection.query(`SELECT * FROM users
                                                 WHERE id = $1`, [userId])
        return res.send(userData).status(200)
    }
    catch (e) {
        console.log(e)
        res.sendStatus(500)
    }
}

async function postUserAddress (req,res) {
    const {titleAddress, address, CPF} = req.body
    const authorization = req.headers['authorization']
    console.log(authorization)
    const token = authorization?.replace('Bearer ', '')

    try {
        const validUser = await connection.query(`SELECT * FROM sessions
                                                  WHERE token = $1`, [token])
        if(!validUser.rows.length) return res.sendStatus(401)
        const userId = validUser.rows[0].userId

        const { error } = addressSchema.validate(req.body);
        if(error) return res.status(422).send({ error: error.details[0].message })

        const addressIsRegistered = await connection.query(`SELECT * FROM "userData" 
                                                            WHERE "titleAddress" = $1
                                                            AND "userId"=$2`,
                                                            [titleAddress, validUser.rows[0].userId])
        if(addressIsRegistered.rows.length) return res.sendStatus(409)
        
        await connection.query(`INSERT INTO "userData" ("userId", "titleAddress", address, "CPF")
                                VALUES ($1, $2, $3, $4)`, 
                                [userId, titleAddress, address, CPF])
        return res.sendStatus(201)
    }

    catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

async function postCard (req,res) {
    const {cardNumber, cardName, validity} = req.body
    const authorization = req.headers['authorization']
    const token = authorization?.replace('Bearer ', '')

    try {
        const validUser = await connection.query(`SELECT * FROM sessions
                                                  WHERE token = $1`, [token])
        if(!validUser.rows.length) return res.sendStatus(401)
        const userId = validUser.rows[0].userId

        const { error } = cardSchema.validate(req.body);
        if(error) return res.status(422).send({ error: error.details[0].message })
        
        await connection.query(`INSERT INTO payment ("userId", "cardNumber", "cardName", "validity")
                                VALUES ($1, $2, $3, $4)`, 
                                [userId, cardNumber, cardName, validity])
        res.sendStatus(201)
    }

    catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

async function getAddress (req,res) {
    const authorization = req.headers['authorization']
    const token = authorization?.replace('Bearer ', '')

    try {
        const validUser = await connection.query(`SELECT * FROM sessions
                                                  WHERE token = $1`, [token])
        if(!validUser.rows.length) return res.sendStatus(401)
        
        const address = await connection.query(`SELECT * FROM "userData"
                                                WHERE "userId" = $1`, [validUser.rows[0].userId])

        res.send(address.rows)
    }
    catch(e){
        console.log(e)
    }
}

async function finishOrder (req,res) {
    const {payment} = req.body
    const authorization = req.headers['authorization']
    const token = authorization?.replace('Bearer ', '')

    try {
        const validUser = await connection.query(`SELECT * FROM sessions
                                                  WHERE token = $1`, [token])
        if(!validUser.rows.length) return res.sendStatus(401)

        const userId = validUser.rows[0].userId
        
        const getProducts = await connection.query(`SELECT cart.*, products."productName", products.price, products."salePrice" 
                                                    FROM cart JOIN products
                                                    ON products.sku = cart.sku
                                                    WHERE cart."userId" = $1`, [userId])

        console.log(getProducts.rows)
        const cartList = getProducts.rows

        cartList.map(async item => {
            const {userId, productName, quantity, sku, price, salePrice} = item
            await connection.query(`INSERT INTO sales ("userId", payment, "productName", price, "salePrice", sku, quantity)
                                    VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
                                    [userId, payment, productName, price, salePrice, sku, quantity])
        })
        
        res.sendStatus(201)
    }
    catch (e){
        console.log(e)
        return res.sendStatus(500)
    }
}


export {getUsers, postUserAddress, postCard, getAddress, finishOrder};