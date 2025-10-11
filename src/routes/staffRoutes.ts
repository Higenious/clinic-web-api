import express from "express";
import {
  getDoctors,
  approveUser,
  getPatientsByDoctor,
} from "../controllers/admin/adminController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/roleCheck";

import { addPatient, getTodayAppointment, makeAppointment } from "../controllers/staff/appointment.controller";

const router = express.Router();


/** or make upcoming appointment */
router.get('/todayAppointments', getTodayAppointment );
router.get('/patient', addPatient);
router.post('/appointment', makeAppointment);

export default router;
