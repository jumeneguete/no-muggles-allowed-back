import express from 'express'
import cors from 'cors'
import connection from "./database/database.js"

import { getCartProducts, deleteItem } from './controllers/cartController.js'
import { getUserData, postUserAdress } from './controllers/checkoutController.js'
// import bcrypt from 'bcrypt';
// import { v4 as uuid } from 'uuid';
// import joi from 'joi';

const app = express();
app.use(cors());
app.use(express.json());


app.get('/cart', getCartProducts)
app.post('/delete-item', deleteItem)
app.get('/checkout', getUserData)
app.post('/useraddress', postUserAdress)

export default app;