import express from 'express';
import adminRoutes from './routes/adminRoutes';
import doctorRoutes from './routes/doctorRoutes';
import authRoutes from './routes/authRoutes';
import staffRoutes from './routes/staffRoutes';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './utils/logger';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: '*', // TODO: Restrict to frontend domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ Parse JSON
app.use(express.json());

// ✅ Log every incoming request except /api/health
app.use((req, res, next) => {
  if (req.path !== '/api/health') {
    logger.info(`🔥 Incoming Request: ${req.method} ${req.originalUrl}`);
  }
  next();
});

// ✅ Simple, lightweight health check (very important for ECS/ALB)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ✅ Initialize routes
logger.info('Initializing routes...');
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/staff', staffRoutes);

// ✅ MongoDB connection
console.log('process.env.MONGO_URI =>', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    logger.info('✅ Successfully connected to MongoDB');
  })
  .catch((err) => {
    logger.error(`❌ MongoDB Connection Error: ${err.message}`);
  });

// ✅ Test route
app.get('/test', (req, res) => res.send('Server is working 🚀'));

// ✅ Start server
logger.info('About to start server...');
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🔥 Server running on port ${PORT}`);
});

export default app;
