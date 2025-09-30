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
exports.getAllMedicinesLists = exports.createHospital = exports.getPatientsByDoctor = exports.approveUser = exports.getDoctors = void 0;
const User_1 = __importDefault(require("../../models/User"));
const Patient_1 = __importDefault(require("../../models/Patient"));
const Hospital_1 = __importDefault(require("../../models/Hospital"));
console.log('=========>admin controller');
// GET /admin/doctors
const getDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield User_1.default.find({ role: 'doctor' });
        res.json(doctors);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching doctors' });
    }
});
exports.getDoctors = getDoctors;
// PATCH /admin/approve-user/:userId
const approveUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield User_1.default.findByIdAndUpdate(userId, { isApproved: true }, { new: true });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User approved', user });
    }
    catch (err) {
        res.status(500).json({ message: 'Error approving user' });
    }
});
exports.approveUser = approveUser;
// GET /admin/patients/:doctorId
const getPatientsByDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId } = req.params;
    try {
        const patients = yield Patient_1.default.find({ doctor: doctorId });
        res.json(patients);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching patients' });
    }
});
exports.getPatientsByDoctor = getPatientsByDoctor;
const createHospital = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: 'Hospital name is required' });
        }
        // 👇 Generate hospitalId
        let hospitalId = generateHospitalId(name);
        // Check for uniqueness and regenerate if needed
        while (yield Hospital_1.default.findOne({ hospitalId })) {
            hospitalId = generateHospitalId(name);
        }
        const hospital = new Hospital_1.default({ name, address, hospitalId });
        yield hospital.save();
        res.status(201).json({
            message: 'Hospital created successfully',
            hospital,
        });
    }
    catch (err) {
        console.error('Hospital creation failed:', err);
        res.status(500).json({ message: 'Failed to create hospital', error: err });
    }
});
exports.createHospital = createHospital;
function generateHospitalId(name) {
    const firstWord = name.trim().split(' ')[0];
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    return `HOSPI${firstWord}${randomDigits}`;
}
/** Medicines */
const getAllMedicinesLists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Get All Medicines');
    }
    catch (error) {
        console.log('Error in getAllMedicinesLists', error);
    }
});
exports.getAllMedicinesLists = getAllMedicinesLists;
