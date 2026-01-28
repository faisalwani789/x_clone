
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { blockPost, blockUser, getDashboard, getUsers, unblockPost, unBlockUser } from "../controllers/admin.controller.js";
import {  getProfilePosts,getProfile } from "../controllers/profile.controller.js";

const router=Router()
router.get('/',authMiddleware,isAdmin,getDashboard)
router.get('/users',authMiddleware,isAdmin,getUsers)
router.patch('/users/block',authMiddleware,isAdmin,blockUser)
router.patch('/users/unblock',authMiddleware,isAdmin,unBlockUser)

// router.get('/user/posts',authMiddleware,isAdmin,getProfilePosts)
// router.get('/user/:id',authMiddleware,isAdmin,getProfile)

router.patch('/tweets/block',authMiddleware,isAdmin,blockPost)
router.patch('/tweets/unblock',authMiddleware,isAdmin,unblockPost)

export default router