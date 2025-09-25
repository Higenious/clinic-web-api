"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const roleCheck_1 = require("../middlewares/roleCheck");
const appointment_controller_1 = require("../controllers/staff/appointment.controller");
const router = express_1.default.Router();
/** or make upcoming appointment */
router.get('/todayAppointments', auth_middleware_1.authMiddleware, (0, roleCheck_1.requireRole)('doctor'), appointment_controller_1.getTodayAppointment);
router.get('/patient', auth_middleware_1.authMiddleware, (0, roleCheck_1.requireRole)('doctor'), appointment_controller_1.addPatient);
router.post('/appointment', auth_middleware_1.authMiddleware, (0, roleCheck_1.requireRole)('doctor'), appointment_controller_1.makeAppointment);
exports.default = router;
