"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const visitSchema = new mongoose_1.default.Schema({
    patient: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    notes: String,
    prescription: String,
}, { timestamps: true });
exports.default = mongoose_1.default.model('visit', visitSchema);
