import express from "express";
import {
  getDoctors,
  approveUser,
  getPatientsByDoctor,
} from "../controllers/admin/adminController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/roleCheck";
import { addPatientNote, addPrescription, getPatients, registerDoctor } from "../controllers/doctor/doctorController";
import { addMedicineListBulk, getAllCommonMedicines } from "../controllers/medicines/medicines.controller";
import { cancelAppointment, finalizeVisitAndPrescribe, getPatientDetails, getTodayAppointment, makeAppointment } from "../controllers/staff/appointment.controller";
const router = express.Router();


console.log('******* Doctor Route ******');

router.post("/register", registerDoctor);
router.patch("/approve-user/:userId", approveUser);
router.get('/patients',  requireRole('doctor'), getPatients);
router.post('/patients/:id/notes', requireRole('doctor'),addPatientNote);


/*** Medicines routews*/
router.post('/medicines', addMedicineListBulk);
router.get('/medicines', getAllCommonMedicines);


/** Get Appoitnments */
router.get('/getTodayAppointment/:doctorId/:hospitalId', getTodayAppointment);
router.post('/appointment', makeAppointment);
router.put('/appointment/cancel/:appointmentId', cancelAppointment);
router.put('/appointment/finalize/:appointmentId', finalizeVisitAndPrescribe);

/** Patient routes */
router.get('/getTodayAppointment/:doctorId/:hospitalId', getTodayAppointment);
router.get('/patient-details/phone/:phone/:doctorId/:hospitalId', getPatientDetails);


router.get('/test', (req, res) => {
  res.send('Doctor route is working');
});

export default router;
