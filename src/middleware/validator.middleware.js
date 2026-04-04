import { validationResult } from "express-validator";


export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty()){
        return next()
    }

    const extractedError = [];//we create new array just for make errors clean-> [err path : err msg]
    errors.array().map((err) => extractedError.push({
        [err.path]: err.msg
    }));

    return res.status(422).json({
        success:false,
        message: "recieved data is not valid",
        extractedError,
    })
}