import { Router } from "express";
import {getProfile, getProfilePosts, setPrivateProfile} from "../controllers/profile.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
const router=Router()
router.get('/posts',authMiddleware,getProfilePosts)
router.get('/:id',authMiddleware,getProfile)

router.post('/private',authMiddleware,setPrivateProfile)


export default router