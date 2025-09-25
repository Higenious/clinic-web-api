import express from 'express';
import { loginUser } from '../controllers/auth.controller';


const router = express.Router();

router.post('/login', loginUser); // Common login route for all roles


export default router;
