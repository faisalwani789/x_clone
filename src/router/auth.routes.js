import { Router } from "express";
import { emailValidator,passwordValidator,nameValidator, otpValidate} from "../validators/auth.validator.js";
import { activate2Fa, addUser, forgetPassword, loginUser, loginUser2Fa, refreshToken, request2Fa, resetPassword, sendOtp, verifyUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { rateLimiter } from "../middlewares/rate.limiter.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import {authMiddleware} from '../middlewares/auth.middleware.js'
const router=Router()
router.post('/register',
    upload.fields(
        [{name:'profile',maxCount:1},
        {name:'cover',maxCount:1}]
    ),
     [emailValidator,passwordValidator,nameValidator], validate,
    addUser)
router.post('/login', rateLimiter, [emailValidator,passwordValidator],validate,loginUser)

router.post('/refresh-token',refreshToken)

router.post('/send-otp',[emailValidator],validate,sendOtp)
router.post('/verify-user',[emailValidator,otpValidate],validate,verifyUser)

router.post('/forgot-password',[emailValidator],validate,forgetPassword)
router.post('/reset-password',[passwordValidator],validate,resetPassword)

router.get('/2fa',authMiddleware, request2Fa)
router.post('/2fa',authMiddleware,activate2Fa)
router.post('/login/2fa',loginUser2Fa)
export default router