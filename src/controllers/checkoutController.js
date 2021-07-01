import connection from "../database/database.js"
import { adressSchema } from "../schemas/checkoutSchema.js"

async function getUserData (req,res) {
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
    const token = authorization?.replace('Bearer ', '')

    try {
        const validUser = await connection.query(`SELECT * FROM sessions
                                                  WHERE token = $1`, [token])
        if(!validUser.rows.length) return res.sendStatus(401)
        const userId = validUser.rows[0].userId

        const { error } = adressSchema.validate(req.body);
        if(error) return res.status(422).send({ error: error.details[0].message })
        
        await connection.query(`INSERT INTO "userData" ("userId", "titleAddress", address, "CPF")
                                VALUES ($1, $2, $3, $4)`, 
                                [userId, titleAddress, address, CPF])
        res.sendStatus(201)
    }

    catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export {getUserData, postUserAddress};