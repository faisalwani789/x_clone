import { Router } from "express";
import { getProfile} from "../controllers/profile.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
const router=Router()
router.get('/',getProfile)


export default router