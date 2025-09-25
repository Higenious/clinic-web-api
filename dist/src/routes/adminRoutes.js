"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/admin/adminController");
console.log('admin routes===>');
const router = express_1.default.Router();
router.get("/doctors", adminController_1.getDoctors);
router.post('/create-hospital', adminController_1.createHospital);
router.patch("/approve-user/:userId", adminController_1.approveUser);
router.get("/patients/:doctorId", adminController_1.getPatientsByDoctor);
exports.default = router;
