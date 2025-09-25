// models/User.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'doctor' | 'admin' | 'staff';
  hospitalId?: mongoose.Types.ObjectId;
  isApproved: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['doctor', 'admin', 'staff'], required: true },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: function () {
      return this.role !== 'admin';
    },
  },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});


const User = mongoose.model<IUser>('User', userSchema);
export default User;
