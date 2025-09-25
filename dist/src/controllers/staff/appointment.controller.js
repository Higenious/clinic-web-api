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
exports.getTodayAppointment = exports.makeAppointment = exports.addPatient = void 0;
// controllers/staff/patient.controller.ts
const Appointment_1 = __importDefault(require("../../models/Appointment"));
const Patient_1 = __importDefault(require("../../models/Patient"));
const addPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, dob, gender, address, doctorId } = req.body;
        const patient = yield Patient_1.default.create({
            name,
            email,
            phone,
            dob,
            gender,
            address,
            doctor: doctorId
        });
        res.status(201).json({ message: 'Patient added', patient });
    }
    catch (err) {
        console.error('Error adding patient', err);
        res.status(500).json({ message: 'Error adding patient' });
    }
});
exports.addPatient = addPatient;
/** Make appointment for today */
const makeAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { patientId, doctorId, date, reason } = req.body;
        const appointment = yield Appointment_1.default.create({
            patient: patientId,
            doctor: doctorId,
            date,
            reason
        });
        res.status(201).json({ message: 'Appointment created', appointment });
    }
    catch (error) {
        console.log('Error while making appointment for today', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.makeAppointment = makeAppointment;
/** Make all todays appointment */
const getTodayAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctorId = req.user.id; // assuming user is added by `authMiddleware`
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        const appointments = yield Appointment_1.default.find({
            doctor: doctorId,
            date: { $gte: todayStart, $lte: todayEnd },
        }).populate('patient');
        res.status(200).json({ appointments });
    }
    catch (error) {
        console.log('Error fetching today’s appointments', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getTodayAppointment = getTodayAppointment;
