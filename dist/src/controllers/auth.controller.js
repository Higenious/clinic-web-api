"use strict";
// controllers/authController.ts
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
exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const uuid_1 = require("uuid"); // You'll need to install the 'uuid' package (npm install uuid @types/uuid)
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(`Backend: Received login request for email: ${email}`);
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user)
            return res.status(401).json({ message: 'Invalid email or password.' });
        if (!user.isApproved)
            return res.status(403).json({ message: 'User is not approved yet.' });
        const isMatch = yield bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid email or password.' });
        // 1. Generate a unique ID for this session (JTI)
        const sessionId = (0, uuid_1.v4)();
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
            role: user.role,
            hospitalId: user.hospitalId,
            jti: sessionId, // <--- EMBED THE SESSION ID IN THE TOKEN
        }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '7d' });
        // 2. Update the user's active session ID in the database
        yield User_1.default.updateOne({ _id: user._id }, { activeSessionId: sessionId });
        return res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role,
                hospitalId: user.hospitalId,
            },
        });
    }
    catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.loginUser = loginUser;
