import mongoose, { Schema, Document } from 'mongoose';

export interface IHospital extends Document {
  name: string;
  address?: string;
  hospitalId: string;
  regNumber: string;
  hospitalLogo: string;
  hospitalPhone: Number;
}

const hospitalSchema = new Schema<IHospital>({
  name: { type: String, required: true },
  address: { type: String },
  regNumber : {type: String},
  hospitalLogo : {type:String},
  hospitalPhone: {type:Number},
  hospitalId: {
    type: String,
    required: true,
    unique: true,
  },
});

const Hospital = mongoose.model<IHospital>('Hospital', hospitalSchema);
export default Hospital;
