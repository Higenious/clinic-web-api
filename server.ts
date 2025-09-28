// server.ts

import express from 'express';
import adminRoutes from './src/routes/adminRoutes';
import doctorRoutes from './src/routes/doctorRoutes';
import authRoutes from './src/routes/authRoutes';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors'; // <--- 1. Import CORS

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const app = express();

// 2. Configure and use CORS middleware
// Allowing requests from all origins (*). 
// You should restrict this to your actual frontend domain(s) in a production environment.
app.use(cors({
  origin: [
    'http://localhost:5173', // Your frontend application's origin
    'http://127.0.0.1:5173', // Include 127.0.0.1 as a safe measure
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Important if you use cookies or sessions
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`🔥 Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);

mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log('🔥 Succefully Connected to MongoDB');
});

// Test route
app.get('/test', (req, res) => res.send('Server is working'));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔥 Sucessfully Started running Server on port ${PORT}`);
});

export default app;