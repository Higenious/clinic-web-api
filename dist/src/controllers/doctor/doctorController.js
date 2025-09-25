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
exports.addPrescription = exports.addPatientNote = exports.getPatients = exports.registerDoctor = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../models/User"));
const Patient_1 = __importDefault(require("../../models/Patient"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const Hospital_1 = __importDefault(require("../../models/Hospital"));
const registerDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, hospitalId: hospitalCode } = req.body;
    try {
        // Validate password here if needed...
        // Check if doctor already exists
        const exists = yield User_1.default.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Doctor already exists' });
        }
        // ✅ Look up hospital by custom ID
        const hospital = yield Hospital_1.default.findOne({ hospitalId: hospitalCode });
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found with code ' + hospitalCode });
        }
        const passwordHash = yield bcryptjs_1.default.hash(password, 10);
        const doctor = yield User_1.default.create({
            name,
            email,
            passwordHash,
            role: 'doctor',
            hospitalId: hospital._id, // ✅ Use actual Mongo ObjectId
            isApproved: false,
        });
        const token = (0, auth_middleware_1.generateToken)({ email: email, role: doctor.role });
        return res.status(201).json({
            message: 'Registration succeeded',
            token,
            user: doctor,
        });
    }
    catch (err) {
        console.error('Doctor registration error:', err);
        res.status(500).json({ message: 'Registration failed', error: err });
    }
});
exports.registerDoctor = registerDoctor;
/** get patient */
const getPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.user.id;
        const patients = yield Patient_1.default.find({ doctor: doctorId });
        res.json(patients);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching patients' });
    }
});
exports.getPatients = getPatients;
const addPatientNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.user.id;
        const patientId = req.params.id;
        const { content } = req.body;
        const patient = yield Patient_1.default.findById(patientId);
        if (!patient)
            return res.status(404).json({ message: 'Patient not found' });
        patient.notes.push({ doctor: doctorId, content });
        yield patient.save();
        res.status(201).json({ message: 'Note added', notes: patient.notes });
    }
    catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.addPatientNote = addPatientNote;
const addPrescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.user.id;
        const patientId = req.params.id;
        const { medications, instructions } = req.body;
        const patient = yield Patient_1.default.findById(patientId);
        if (!patient)
            return res.status(404).json({ message: 'Patient not found' });
        patient.prescriptions.push({ doctor: doctorId, medications, instructions });
        yield patient.save();
        res.status(201).json({ message: 'Prescription added', prescriptions: patient.prescriptions });
    }
    catch (error) {
        console.error('Error adding prescription:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.addPrescription = addPrescription;
