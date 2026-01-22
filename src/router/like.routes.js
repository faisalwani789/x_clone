import { addTweetLike } from "../controllers/likes.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router=Router()
router.post('/',authMiddleware,addTweetLike)


export default router