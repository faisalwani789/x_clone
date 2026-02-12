import { body } from "express-validator";

export const passwordValidator = body('password')
  .trim()
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')

export const emailValidator=body('email')
  .trim()
  .isEmail()
  .withMessage('Valid email is required')
  .normalizeEmail();

export const nameValidator=body('fullName')
  .trim()
  .notEmpty()
  .withMessage('name is required')
  .isString()
  .withMessage('Valid name is required')
  .isLength({min:3})
  .withMessage('minimum 3 characters are allowed')

export const otpValidate=body('otp')
.trim()
.notEmpty()
.withMessage('otp is required')
.isLength({min:6,max:6})
.withMessage('only six digits are allowed')