import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { AcceptRequest, getFollowers, getFollowRequests, sendRequest } from "../controllers/friendRequest.controller.js";
const router=Router()
router.post('/',authMiddleware,sendRequest)
router.get('/',authMiddleware,getFollowers)
router.patch('/request/:id',authMiddleware,AcceptRequest)
router.get('/request',authMiddleware,getFollowRequests)

export default router