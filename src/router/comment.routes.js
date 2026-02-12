import { getTweetComments,addTweetComments } from "../controllers/comment.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validatecomment } from "../validators/comment.validator.js";
import { validateType,validateTweetId, } from "../validators/tweet.validator.js";
import { validate } from "../middlewares/validation.middleware.js";

const router=Router()
router.post('/',
    [validateType, validateTweetId,validatecomment],validate,
    authMiddleware,addTweetComments)
router.get('/',authMiddleware,getTweetComments)

export default router