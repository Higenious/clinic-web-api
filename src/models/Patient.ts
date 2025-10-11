import mongoose, { Schema } from 'mongoose';

const noteSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  createdAt: { type: Date, default: Date.now }
});

const prescriptionSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  medications: [{
    medicine: { type: String, required: true },
    quantity: { type: Number, required: true },
    dailyDose: { type: String, required: true }
  }],
  instructions: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  age: Number,
  gender: String,
  // IMPORTANT: 'phone' (mobile number) is set to unique for patient lookup
  phone: { type: String, required: true, unique: true }, 
  email: { type: String, sparse: true, required: false },
  dob: Date,
  address: String,
  medicalHistory: [String],
  notes: [noteSchema],
  prescriptions: [prescriptionSchema]
});

export default mongoose.model('Patient', patientSchema);
