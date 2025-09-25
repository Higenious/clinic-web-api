import express from 'express';
import adminRoutes from './src/routes/adminRoutes';
import doctorRoutes from './src/routes/doctorRoutes';
import authRoutes from './src/routes/authRoutes';

import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);


mongoose.connect(process.env.MONGO_URI!).then(() => {
  console.log('Connected to DB');
});

app.get('/test', (req, res) => res.send('Server is working'));

export default app;
