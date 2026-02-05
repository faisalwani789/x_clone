import { Router } from "express";
import { addUser, forgetPassword, loginUser, refreshToken, resetPassword, sendOtp, verifyEmail } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=Router()
router.post('/register',upload.fields([{name:'profile',maxCount:1},{name:'cover',maxCount:1}]),addUser)
router.post('/login',loginUser)
router.post('/refresh-token',refreshToken)

router.post('/send-otp',sendOtp)
router.post('/verify-email',verifyEmail)

router.post('/forgot-password',forgetPassword)
router.post('/reset-password',resetPassword)

export default router