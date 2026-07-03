import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import v1Router from './api/v1/routes/index.js';
import { errorHandler } from './api/v1/middlewares/error.js';

// Load environment variables
config;

const app = express();

// Middlewares
app.use(cors({
  origin: true, // Reflects the request origin. Change in production.
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.get('/', (req, res) => {
  res.send('Poshok API is running!');
});
app.use('/api/v1', v1Router);

// Global error handler
app.use(errorHandler);

export default app;