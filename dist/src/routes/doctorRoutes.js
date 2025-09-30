"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/admin/adminController");
const roleCheck_1 = require("../middlewares/roleCheck");
const doctorController_1 = require("../controllers/doctor/doctorController");
const medicines_controller_1 = require("../controllers/medicines/medicines.controller");
const router = express_1.default.Router();
console.log('doctor toute');
router.post("/register", doctorController_1.registerDoctor);
router.patch("/approve-user/:userId", adminController_1.approveUser);
router.get('/patients', (0, roleCheck_1.requireRole)('doctor'), doctorController_1.getPatients);
router.post('/patients/:id/notes', (0, roleCheck_1.requireRole)('doctor'), doctorController_1.addPatientNote);
router.post('/patients/:id/prescription', (0, roleCheck_1.requireRole)('doctor'), doctorController_1.addPrescription);
/*** Medicines routews*/
router.get('/medicines', medicines_controller_1.getAllMedicinesLists);
router.post('/medicines', medicines_controller_1.addMedicineLists);
router.get('/test', (req, res) => {
    res.send('Doctor route is working');
});
exports.default = router;
