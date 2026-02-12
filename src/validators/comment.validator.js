import { body } from "express-validator"
export const validatecomment = body('comment')
    .trim()
    .notEmpty()
    .withMessage('comment is required')
    .isString()
    .withMessage('enter a valid comment')
    .isLength({max:255})
    .withMessage('too long')

    