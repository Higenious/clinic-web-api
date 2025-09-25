"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    console.log('token', req.headers.authorization);
    if (!token)
        return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Runtime check to ensure it's not a string
        if (typeof decoded === 'string') {
            return res.status(403).json({ message: 'Invalid token payload' });
        }
        const user = decoded;
        // Optional: verify presence of required fields
        if (!user.id || !user.role) {
            return res.status(403).json({ message: 'Invalid token structure' });
        }
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authMiddleware = authMiddleware;
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '7d',
    });
};
exports.generateToken = generateToken;
