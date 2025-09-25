import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    notes: String,
    prescription: String,
  }, { timestamps: true });



export default mongoose.model('visit', visitSchema);