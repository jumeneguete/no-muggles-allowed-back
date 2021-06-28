import express from 'express';
import cors from 'cors';
// import bcrypt from 'bcrypt';
// import { v4 as uuid } from 'uuid';
// import connection from './database/database.js';
// import joi from 'joi';

const app = express();
app.use(cors());
app.use(express.json());

export default app;