import mongoose, { Schema, Document } from 'mongoose';

export interface IHospital extends Document {
  name: string;
  address?: string;
  hospitalId: string;
}

const hospitalSchema = new Schema<IHospital>({
  name: { type: String, required: true },
  address: { type: String },
  hospitalId: {
    type: String,
    required: true,
    unique: true,
  },
});

const Hospital = mongoose.model<IHospital>('Hospital', hospitalSchema);
export default Hospital;
