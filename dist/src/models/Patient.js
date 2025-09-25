"use strict";
// models/Patient.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const noteSchema = new mongoose_1.default.Schema({
    doctor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
});
const prescriptionSchema = new mongoose_1.default.Schema({
    doctor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    medications: [String], // Or use a more complex structure if needed
    instructions: String,
    createdAt: { type: Date, default: Date.now }
});
const patientSchema = new mongoose_1.default.Schema({
    name: String,
    doctor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    age: Number,
    gender: String,
    phone: String,
    dob: Date,
    address: String,
    medicalHistory: [String],
    notes: [noteSchema],
    prescriptions: [prescriptionSchema]
});
exports.default = mongoose_1.default.model('Patient', patientSchema);
