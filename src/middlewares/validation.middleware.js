import { validationResult } from "express-validator"

export const validation =(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty){
        return res.status(422).json({
            succcess:false,
            errors:errors.array()
        })
    }
    next()
}