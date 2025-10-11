import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },

  // Change from String to [String]
  notes: [{ type: String }],

  // Change from String to structured array
  prescription: [
    {
      medicine: { type: String, required: true },
      quantity: { type: Number, required: true },
      dailyDose: { type: String, required: true }
    }
  ],

  visitType: {
    type: String,
    enum: ['New Patient', 'Follow-up', 'Consultation'],
  },

  bp: { type: String },
  sugar: { type: String },
  weight: { type: Number }
}, { timestamps: true });


export default mongoose.model('Visit', visitSchema);