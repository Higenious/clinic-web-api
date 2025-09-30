import { Schema, model, Document } from 'mongoose';

export interface IMedicine extends Document {
    name: string;
    dosage: string;
    hospitalId: string; // The primary organization responsible for this entry
    doctorId?: string;  // Optional: If the medicine is specific to one doctor
    createdAt: Date;
    updatedAt: Date;
}

const MedicineSchema = new Schema<IMedicine>({
    name: {
        type: String,
        required: [true, 'Medicine name is required'],
        trim: true,
    },
    dosage: {
        type: String,
        default: 'Not Specified',
    },
    hospitalId: {
        type: String,
        required: [true, 'Hospital ID is required for medicine listing'],
        index: true,
    },
    doctorId: {
        type: String,
        required: false,
        index: true,
    },
}, { 
    timestamps: true // Adds createdAt and updatedAt fields
});

// Export the Mongoose Model
export const Medicine = model<IMedicine>('Medicine', MedicineSchema);
