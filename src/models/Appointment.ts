import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    reason: String,
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    reminderSent: { type: Boolean, default: false }
  }, { timestamps: true });

export default mongoose.model('Appointment', appointmentSchema);
