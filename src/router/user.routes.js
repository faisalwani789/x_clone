import { Router } from "express";
import { addUser, loginUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=Router()
router.post('/',upload.fields([{name:'profile',maxCount:1},{name:'cover',maxCount:1}]),addUser)
router.post('/login',loginUser)

export default router