import express from 'express'
import cors from 'cors'
import connection from "./database/database.js"

import { getCartProducts, deleteItem } from './controllers/cartController.js'
import { getUserData, postUserAddress, postCard } from './controllers/checkoutController.js'
import postSingUp from './controllers/singUpContrroller.js';
import postSingIn from './controllers/singInController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/cart', getCartProducts)
app.post('/delete-item', deleteItem)
app.get('/checkout', getUserData)
app.post('/useraddress', postUserAddress)
app.post('/savecard', postCard)
app.post('/sign-up', postSingUp);
app.post('/sign-in', postSingIn);

export default app;