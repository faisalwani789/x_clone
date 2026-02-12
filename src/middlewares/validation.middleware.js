import { validationResult } from "express-validator"

export const validate =(req,res,next)=>{
    const errors=validationResult(req)
    // console.log(JSON.stringify(errors,null,2))
    if(!errors.isEmpty()){
        return res.status(422).json({
            succcess:false,
            errors:errors.array()
        })
    }
    next()
}