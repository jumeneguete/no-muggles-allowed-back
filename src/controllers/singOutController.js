import connection from "../database/database.js";
import signUpSchema from "../schemas/signUpSchema.js";
import bcrypt from 'bcrypt';

async function postSingOut(req,res){
    const authorization = req.header('Authorization');
    const token = authorization?.replace('Bearer ', '');
   
    try{
        await connection.query(`
        DELETE FROM sessions
        WHERE token = $1`,[token])

        res.sendStatus(200)
    } catch(error){
        console.log(error)
        res.sendStatus(501)
    }
}

export default postSingOut;