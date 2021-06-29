import connection from "../database/database.js"
import adressSchema from "../schemas/checkoutSchema"

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

async function postUserAdress (req,res) {

    const {titleAddress, address, cpf} = req.body
    const authorization = req.headers['authorization']
    const token = authorization?.replace('Bearer ', '')

    try {
        const validUser = await connection.query(`SELECT * FROM sessions
                                                  WHERE token = $1`, [token])
        if(!validUser.rows.length) return res.sendStatus(401)
        const userId = validUser.rows[0].userId

        const { error } = adressSchema.validate(req.body);
        if(error) return res.status(422).send({ error: error.details[0].message })
        
        await connection.query('INSERT INTO userdata (userid, titleaddress, address, cpf)', 
                                [userId, titleAddress, address, cpf])
    }

    catch (e) {
        console.log(e)
        return res.sendStatus(500)
    }
}

export {getUserData, postUserAdress};