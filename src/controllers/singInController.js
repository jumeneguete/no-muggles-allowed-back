import connection from "../database/database.js";
import signInSchema from "../schemas/signInSchema.js";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

async function postSingIn(req,res){
    const { email, password } = req.body;

    const { error } = signInSchema.validate({email: email, password: password});
    
    if (error !== undefined) return res.sendStatus(400);

    try {
    
        const result = await connection.query(`
            SELECT * FROM users
            WHERE email = $1
        `,[email]);
        const user = result.rows[0];

        if(user && bcrypt.compareSync(password, user.password)) {
            const token = uuidv4();
            await connection.query(`
                INSERT INTO sessions 
                ("userId", token)
                VALUES ($1, $2)
            `, [user.id, token]);
        
            const data = {
                user: {id: user.id, name: user.name, email: user.email}, 
                token
            };
            return res.send(data).status(200);
        } else {
            return res.sendStatus(401);
        };
    } catch(e){
        console.log(e.error);
        return res.sendStatus(500);
    };
}

export default postSingIn;