import express from "express";
import {
  getDoctors,
  approveUser,
  getPatientsByDoctor,
  createHospital,
  getPatientByDoctor
} from "../controllers/admin/adminController";


const router = express.Router();

router.get("/doctors/:hospitalId", getDoctors);
router.post('/create-hospital', createHospital);
router.patch("/approve-user/:userId",approveUser);

router.get("/patients/:doctorId", getPatientsByDoctor);
router.get("/patient/:doctorId/:mobile", getPatientByDoctor);

export default router;
