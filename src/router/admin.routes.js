
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { getDashboard, getUsers } from "../controllers/admin.controller.js";
import { getProfile } from "../controllers/profile.controller.js";

const router=Router()
router.get('/users',authMiddleware,isAdmin,getUsers)
router.get('/',authMiddleware,getDashboard)
router.get('/user',authMiddleware,isAdmin,getProfile)
export default router