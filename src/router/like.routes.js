import { addTweetLike } from "../controllers/likes.controller.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {validate} from '../middlewares/validation.middleware.js'
import { validateType,validateTweetId } from "../validators/tweet.validator.js";


const router=Router()
router.post('/',[validateType,validateTweetId],validate,authMiddleware,addTweetLike)


export default router