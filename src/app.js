import express from 'express';
import cors from 'cors';
import postSingUp from './controllers/singUpContrroller.js';
import postSingIn from './controllers/singInController.js';
import postSingOut from './controllers/singOutController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', postSingUp);
app.post('/sign-in', postSingIn);
app.post('/sign-out', postSingOut);

export default app;