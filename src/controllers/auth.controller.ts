// controllers/authController.ts

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
const uuidv4 = require('uuid').v4;


export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(`Backend: Received login request for email: ${email}`);

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: 'Invalid email or password.' });

    if (!user.isApproved)
      return res.status(403).json({ message: 'User is not approved yet.' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password.' });

    const sessionId = uuidv4();
    console.log('generateSessionId====>', sessionId);
 
    // 1. Generate a unique ID for this session (JTI)

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        hospitalId: user.hospitalId,
        jti: sessionId,
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '7d' }
    );

    // 2. Update the user's active session ID in the database
    await User.updateOne(
        { _id: user._id },
        { activeSessionId: sessionId }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        hospitalId: user.hospitalId,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};