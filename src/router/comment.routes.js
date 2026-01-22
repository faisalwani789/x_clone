import { getTweetComments,addTweetComments } from "../controllers/comment.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router=Router()
router.post('/',authMiddleware,addTweetComments)
router.get('/',authMiddleware,getTweetComments)

export default router