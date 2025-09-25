import express from "express";
import {
  getDoctors,
  approveUser,
  getPatientsByDoctor,
} from "../controllers/admin/adminController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/roleCheck";
import { getPatients, registerDoctor } from "../controllers/doctor/doctorController";
import { addPatient, getTodayAppointment, makeAppointment } from "../controllers/staff/appointment.controller";

const router = express.Router();


/** or make upcoming appointment */
router.get('/todayAppointments', authMiddleware, requireRole('doctor'),getTodayAppointment );
router.get('/patient', authMiddleware, requireRole('doctor'), addPatient);
router.post('/appointment', authMiddleware, requireRole('doctor'), makeAppointment);

export default router;
