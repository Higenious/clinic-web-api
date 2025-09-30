import express from "express";
import {
  getDoctors,
  approveUser,
  getPatientsByDoctor,
} from "../controllers/admin/adminController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/roleCheck";
import { addPatientNote, addPrescription, getPatients, registerDoctor } from "../controllers/doctor/doctorController";
import { getAllMedicinesLists, addMedicineLists } from "../controllers/medicines/medicines.controller";
const router = express.Router();


console.log('doctor toute');
router.post("/register", registerDoctor);

router.patch("/approve-user/:userId", approveUser);
router.get('/patients',  requireRole('doctor'), getPatients);
router.post('/patients/:id/notes', requireRole('doctor'),addPatientNote);
router.post('/patients/:id/prescription', requireRole('doctor'), addPrescription);

/*** Medicines routews*/
router.get('/medicines', getAllMedicinesLists);
router.post('/medicines', addMedicineLists);

router.get('/test', (req, res) => {
  res.send('Doctor route is working');
});

export default router;
