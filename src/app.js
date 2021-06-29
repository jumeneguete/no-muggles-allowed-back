import express from 'express'
import cors from 'cors'
import connection from "./database/database"

import getCartProducts from './controllers/cartController.js'
import { getUserData, postUserAdress } from './controllers/checkoutController'
// import bcrypt from 'bcrypt';
// import { v4 as uuid } from 'uuid';
// import joi from 'joi';

const app = express();
app.use(cors());
app.use(express.json());


app.get('/cart', getCartProducts)
app.get('/checkout', getUserData)
app.post('/useradress', postUserAdress)

export default app;