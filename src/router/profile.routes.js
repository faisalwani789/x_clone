import { Router } from "express";
import { getProfile, setPrivateProfile} from "../controllers/profile.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
const router=Router()
router.get('/',getProfile)
router.post('/private',setPrivateProfile)


export default router