"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appointmentSchema = new mongoose_1.default.Schema({
    patient: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Patient' },
    doctor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    reason: String,
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    reminderSent: { type: Boolean, default: false }
}, { timestamps: true });
exports.default = mongoose_1.default.model('Appointment', appointmentSchema);
