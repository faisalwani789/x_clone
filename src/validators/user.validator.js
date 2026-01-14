import { body } from "express-validator";

export const validateUser=[
    body('name').notEmpty().withMessage('name is required'),
    body('password').isLength({min:8}).withMessage('password must be above 7 characters'),
    body('email').notEmpty().withMessage('email is required'),
    body('profile').notEmpty(),
    body('username').notEmpty().withMessage('enter username')
]