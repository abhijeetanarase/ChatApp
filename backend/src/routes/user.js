import  { Router } from 'express';
const router = Router();
import { registerUser , loginUser, redirectToGoogle, googleAuthCallback, verifyEmail } from '../controllers/user.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/google' , redirectToGoogle)
router.get('/google/callback', googleAuthCallback)
router.get('/verify-email' , verifyEmail)


export default router;