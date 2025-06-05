import { Router } from 'express';
const router = Router();
import { registerUser, loginUser, redirectToGoogle, googleAuthCallback, verifyEmail, forgotPassword, resetPassword } from '../controllers/user.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/google', redirectToGoogle);
router.get('/google/callback', googleAuthCallback);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;