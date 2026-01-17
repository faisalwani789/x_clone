import { Router } from "express";
import { addTweet,getTweets, getTweetComments} from "../controllers/tweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router=Router()
router.post('/',authMiddleware,upload.array('media',4),addTweet)
router.get('/comments',authMiddleware,getTweetComments)
router.get('/',getTweets)


export default router