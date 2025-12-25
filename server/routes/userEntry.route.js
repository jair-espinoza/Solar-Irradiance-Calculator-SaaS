import {Router} from 'express';
import { calcEntry, getUserEntries } from '../controllers/userEntry.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post("/calculate", authMiddleware, calcEntry)
router.get("/dashboard", authMiddleware, getUserEntries)
export default router