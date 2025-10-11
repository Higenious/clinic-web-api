import express from 'express';
import adminRoutes from './routes/adminRoutes';
import doctorRoutes from './routes/doctorRoutes';
import authRoutes from './routes/authRoutes';
import staffRoutes from './routes/staffRoutes'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import logger from './utils/logger';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();

// 2. Configure and use CORS middleware
// Allowing requests from all origins (*). 
// You should restrict this to your actual frontend domain(s) in a production environment.
app.use(cors({
  origin: '*', // CHANGE THIS TO YOUR FRONTEND URL IN PRODUCTION!
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Crucial if sending tokens/cookies
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`🔥 Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);

console.log('process.env.MONGO_URI', process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI!).then(() => {
  logger.info('Successfully Connected to MongoDB 🔥');
}).catch((err) => {
  logger.error(`MongoDB Connection Error: ${err.message}`);
});

// Test route
app.get('/test', (req, res) => res.send('Server is working'));

logger.info('About to start server...');
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🔥 Sucessfully Started running Server on port ${PORT}`);
});

export default app;