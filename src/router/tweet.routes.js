import { Router } from "express";
import { addTweet,getTweets, getFollowingTweets} from "../controllers/tweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router=Router()
router.post('/',authMiddleware,upload.array('media',4),addTweet)
router.get('/',getTweets)
router.get('/follow',authMiddleware,getFollowingTweets)




export default router