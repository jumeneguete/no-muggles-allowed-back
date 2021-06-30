import connection from "../database/database.js";
import signUpSchema from "../schemas/signUpSchema.js";
import bcrypt from 'bcrypt';

async function postSingUp(req,res){
    const { name, lastName, email, password, passwordConfirmation } = req.body;
    
        const { error } = signUpSchema.validate({name: name, lastName: lastName, email: email, password: password, passwordConfirmation: passwordConfirmation});
    
         if (error !== undefined) return res.sendStatus(400);
    
         try{
             const checkEmail = await connection.query(`
                SELECT * FROM users 
                 WHERE email = $1`,[email]);
    
             if(checkEmail.rows.length !==0) return res.sendStatus(409);
    
            const hashPassword = bcrypt.hashSync(password,12)
            const register = await connection.query(`
                 INSERT INTO users (name, lastname, email, password) 
                 VALUES ($1, $2, $3, $4)`,
                 [name, lastName, email, hashPassword])
            
             res.sendStatus(201)
    
         } catch (error){
            console.log(error)
             res.sendStatus(501)
        }   
    
}

export default postSingUp;