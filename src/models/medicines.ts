import { Schema, model, Document } from 'mongoose';

export interface IMedicine extends Document {
    name: string;
    dosage: string;
    hospitalId?: string; 
    doctorId?: string; 
    createdAt: Date;
}

const MedicineSchema = new Schema<IMedicine>({
    name: {
        type: String,
        required: [true, 'Medicine name is required'],
        trim: true,
         unique: true
    },
    dosage: {
        type: String,
        default: 'Not Specified',
    },
    hospitalId: {
        type: String,
        required:false,
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


MedicineSchema.pre('save', function(next) {
  this.name = this.name.toLowerCase().trim();
  next();
});

// Export the Mongoose Model
export const Medicine = model<IMedicine>('Medicine', MedicineSchema);
