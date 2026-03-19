// Authentication routes
// Routes: POST /register, POST /login

import express from 'express';
import {
	registerUser,
	loginUser,
	verifyOtpAndLogin,
	resendLoginOtp,
} from '../controllers/authController.js';
import { loginRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', registerUser);

// POST /api/auth/login - Validate credentials and send OTP
router.post('/login', loginRateLimiter, loginUser);

// POST /api/auth/verify-otp - Verify OTP and issue JWT
router.post('/verify-otp', verifyOtpAndLogin);

// POST /api/auth/resend-otp - Resend OTP with cooldown
router.post('/resend-otp', resendLoginOtp);

export default router;
