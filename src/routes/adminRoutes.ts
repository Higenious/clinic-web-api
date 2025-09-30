import express from "express";
import {
  getDoctors,
  approveUser,
  getPatientsByDoctor,
  createHospital
} from "../controllers/admin/adminController";


const router = express.Router();

router.get("/doctors", getDoctors);
router.post('/create-hospital', createHospital);
router.patch("/approve-user/:userId",approveUser);

router.get("/patients/:doctorId", getPatientsByDoctor);

export default router;
