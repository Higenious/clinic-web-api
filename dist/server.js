"use strict";
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
dotenv_1.default.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Logging middleware
app.use((req, res, next) => {
    console.log(`🔥 Incoming Request: ${req.method} ${req.originalUrl}`);
    next();
});
app.use('/api', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/doctor', doctorRoutes_1.default);
mongoose_1.default.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to DB');
});
// Test route
app.get('/test', (req, res) => res.send('Server is working'));
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
