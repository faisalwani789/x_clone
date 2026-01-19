import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getFollowers, handleRequest } from "../controllers/friendRequrest.controller.js";
const router=Router()
router.post('/',authMiddleware,handleRequest)
router.get('/',authMiddleware,getFollowers)

export default router