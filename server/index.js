import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateRouter from './routes/generate.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api', generateRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Study Assistant Server is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Study Assistant Server listening on http://localhost:${PORT}`);
});
