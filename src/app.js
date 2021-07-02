import express from 'express'
import cors from 'cors'
import { getCartProducts, deleteItem } from './controllers/cartController.js'
import { getUsers, postUserAddress, postCard, getAddress, finishOrder } from './controllers/checkoutController.js'
import getProducts from './controllers/getProducts.js';
import getProductsParams from './controllers/getProductsParams.js';
import postSingUp from './controllers/singUpContrroller.js';
import postSingIn from './controllers/singInController.js';
import postCart from './controllers/postCart.js';
import postSingOut from './controllers/singOutController.js';


const app = express();
app.use(cors());
app.use(express.json());

app.get('/cart', getCartProducts)
app.post('/cart', postCart);
app.get('/useraddress', getAddress);
app.post('/useraddress', postUserAddress)
app.post('/savecard', postCard)
app.post('/sign-up', postSingUp);
app.post('/sign-in', postSingIn);
app.get('/products', getProducts);
app.get('/products/:id', getProductsParams);
app.post('/delete-item', deleteItem)
app.get('/checkout', getUsers)
app.post('/sign-out', postSingOut);
app.post('/finish', finishOrder);

export default app;