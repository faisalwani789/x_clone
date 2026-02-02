import { Router } from "express";
import {getProfile, getProfilePosts, setPrivateProfile, updateProfile} from "../controllers/profile.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router=Router()
router.get('/posts',authMiddleware,getProfilePosts)
router.get('/:id',authMiddleware,getProfile)
router.patch('/',authMiddleware,
    upload.fields([{name:'profile',maxCount:1},{name:'cover',maxCount:1}]),updateProfile)
router.post('/private',authMiddleware,setPrivateProfile)


export default router