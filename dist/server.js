"use strict";
// server.ts
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
const express_1 = __importDefault(require("express"));
const adminRoutes_1 = __importDefault(require("./src/routes/adminRoutes"));
const doctorRoutes_1 = __importDefault(require("./src/routes/doctorRoutes"));
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors")); // <--- 1. Import CORS
dotenv_1.default.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = (0, express_1.default)();
// 2. Configure and use CORS middleware
// Allowing requests from all origins (*). 
// You should restrict this to your actual frontend domain(s) in a production environment.
app.use((0, cors_1.default)({
    origin: '*', // CHANGE THIS TO YOUR FRONTEND URL IN PRODUCTION!
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Crucial if sending tokens/cookies
}));
app.use(express_1.default.json());
// Logging middleware
app.use((req, res, next) => {
    console.log(`🔥 All Incoming Request - - -: ${req.method} ${req.originalUrl}`);
    next();
});
app.get('/health', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const state = mongoose_1.default.connection.readyState;
    if (state === 1) { // 1 = connected
        res.sendStatus(200);
    }
    else {
        res.status(500).json({ status: 'unhealthy', dbState: state });
    }
}));
app.use('/api', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/doctor', doctorRoutes_1.default);
mongoose_1.default.connect(process.env.MONGO_URI).then(() => {
    console.log('Succefully Connected to MongoDB - - ');
});
// Test route
app.get('/test', (req, res) => res.send('Server is working'));
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Sucessfully Started running Server on port ${PORT}`);
});
exports.default = app;
