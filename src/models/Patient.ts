// models/Patient.ts

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const prescriptionSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  medications: [String], // Or use a more complex structure if needed
  instructions: String,
  createdAt: { type: Date, default: Date.now }
});

const patientSchema = new mongoose.Schema({
  name: String,
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  age: Number,
  gender: String,
  phone: String,
  dob: Date,
  address: String,
  medicalHistory: [String],
  notes: [noteSchema],
  prescriptions: [prescriptionSchema]
});

export default mongoose.model('Patient', patientSchema);
