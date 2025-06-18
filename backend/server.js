import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CorsConfig } from './src/config/cors.js';
import authRoutes from './src/routes/authRoutes.js'

const app = express();
const port = process.env.PORT || 3000; 

app.use(express.json());
app.use(cookieParser());
app.use(cors(CorsConfig));

app.get('/', (req, res) => {
  res.send('Hello world!, Templator!');
});

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});