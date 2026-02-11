import { getNotifications, readNotification } from "../controllers/notificaion.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router=Router()
router.get('/',authMiddleware,getNotifications)
router.patch('/read/:notificationId',authMiddleware,readNotification)

export default router