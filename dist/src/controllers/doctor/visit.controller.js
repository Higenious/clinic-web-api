"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addVisitNoteAndPrescription = void 0;
// controllers/doctor/visit.controller.ts
const visit_1 = __importDefault(require("../../models/visit"));
const Patient_1 = __importDefault(require("../../models/Patient"));
const addVisitNoteAndPrescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.user.id;
        const { patientId } = req.params;
        const { notes, prescription } = req.body;
        // Ensure patient exists and is assigned to doctor (optional check)
        const patient = yield Patient_1.default.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        const visit = yield visit_1.default.create({
            patient: patientId,
            doctor: doctorId,
            notes,
            prescription
        });
        res.status(201).json({ message: 'Visit note and prescription added', visit });
    }
    catch (err) {
        console.error('Error adding visit note', err);
        res.status(500).json({ message: 'Error adding visit data' });
    }
});
exports.addVisitNoteAndPrescription = addVisitNoteAndPrescription;
