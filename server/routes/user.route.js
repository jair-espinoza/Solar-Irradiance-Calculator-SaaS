import {Router} from 'express';
import {registerUser, loginUser, logoutUser, getCookieUser} from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(logoutUser)

router.route('/me').get(authMiddleware,getCookieUser)

export default router;