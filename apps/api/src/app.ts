import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js';
import v1Router from './routes/index.js';
import { errorHandler } from './middleware/error.js';

// Load environment variables
config;

const app = express();

// Middlewares
app.use(helmet());

if (config.isProduction && config.corsOrigins.length === 0) {
  console.error(
    'WARNING: CORS_ORIGIN is not set in production. Cross-origin requests will be blocked ' +
    'by default until you set CORS_ORIGIN to a comma-separated list of allowed origins ' +
    '(e.g. https://nevocore.vercel.app).'
  );
}

app.use(cors({
  origin: config.isProduction
    ? config.corsOrigins // fail closed: only these origins are allowed in production
    : true, // reflect any origin in local dev for convenience
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.get('/', (req, res) => {
  res.send('Nevo API is running!');
});
app.use('/api/v1', v1Router);

// Global error handler
app.use(errorHandler);

export default app;