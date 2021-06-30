import express from 'express';
import cors from 'cors';
import postSingUp from './controllers/singUpContrroller.js';
import postSingIn from './controllers/singInController.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/sign-up', postSingUp);
app.post('/sign-in', postSingIn);

export default app;