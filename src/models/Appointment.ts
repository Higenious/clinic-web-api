import mongoose, { Schema, Types } from "mongoose";

const appointmentSchema = new Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  date: Date,
  status: { type: String, enum: ["Scheduled", "Completed", "Cancelled"], default: "Scheduled" },
  reminderSent: { type: Boolean, default: false },
  tokenNumber: { type: Number, default: 1 }
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);
