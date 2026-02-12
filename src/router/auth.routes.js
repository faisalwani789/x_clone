import { Router } from "express";
import { emailValidator,passwordValidator,nameValidator, otpValidate} from "../validators/auth.validator.js";
import { addUser, forgetPassword, loginUser, refreshToken, resetPassword, sendOtp, verifyEmail } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { rateLimiter } from "../middlewares/rate.limiter.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
const router=Router()
router.post('/register', [emailValidator,passwordValidator,nameValidator], validate,
    upload.fields(
        [{name:'profile',maxCount:1},
        {name:'cover',maxCount:1}]
    ),
    addUser)
router.post('/login', rateLimiter, [emailValidator,passwordValidator],validate,loginUser)
router.post('/refresh-token',refreshToken)

router.post('/send-otp',[emailValidator],validate,sendOtp)
router.post('/verify-email',[emailValidator,otpValidate],validate,verifyEmail)

router.post('/forgot-password',[emailValidator],validate,forgetPassword)
router.post('/reset-password',[passwordValidator],validate,resetPassword)

export default router