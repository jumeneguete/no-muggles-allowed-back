import express from 'express';
import cors from 'cors';
import getProducts from './controllers/getProducts.js';
import getProductsParams from './controllers/getProductsParams.js';
import postSingUp from './controllers/singUpContrroller.js';
import postSingIn from './controllers/singInController.js';
import postCart from './controllers/postCart.js';
import postSingOut from './controllers/singOutController.js';


const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', postSingUp);
app.post('/sign-in', postSingIn);
app.get('/products', getProducts);
app.get('/products/:id', getProductsParams);
app.post('/cart', postCart);

app.post('/sign-out', postSingOut);

export default app;