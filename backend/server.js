import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CorsConfig } from './src/config/cors.js';
import authRoutes from './src/routes/authRoutes.js'
import topicRoutes from './src/routes/topicRoutes.js';
import tagRoutes from './src/routes/tagRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import templateRoutes from './src/routes/templateRoute.js';
import imageRoutes from './src/routes/imageRoutes.js';
import formRoutes from './src/routes/formRoutes.js';

const app = express();
const port = process.env.PORT || 3000; 

app.use(express.json());
app.use(cookieParser());
app.use(cors(CorsConfig));

app.get('/', (req, res) => {
  res.send('Hello world!, Templator!');
});

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/users', userRoutes);
app.use('/api/template', templateRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/form', formRoutes);


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});