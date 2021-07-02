import express from 'express'
import cors from 'cors'
import { getCartProducts, deleteItem } from './controllers/cartController.js'
import { getUsers, postUserAddress, postCard, getAddress } from './controllers/checkoutController.js'
import postSingUp from './controllers/singUpContrroller.js';
import postSingIn from './controllers/singInController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/cart', getCartProducts)
app.post('/delete-item', deleteItem)
app.get('/checkout', getUsers)
app.post('/useraddress', postUserAddress)
app.get('/useraddress', getAddress);
app.post('/savecard', postCard)
app.post('/sign-up', postSingUp);
app.post('/sign-in', postSingIn);

export default app;