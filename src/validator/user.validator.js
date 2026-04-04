import {body} from "express-validator";
import { AvailableUserRoles } from "../utils/constants.js";

const registerUserValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("email is required")
            .bail()
            .isEmail().withMessage("Invalid email address"),
        body("username")
            .trim()
            .notEmpty().withMessage("Username is required")
            .bail()
            .isLength({min:3}).withMessage("username must be atleast 3 characters long")
            .isLength({max:20}).withMessage("username can be atmost 20 characters long")
            .isLowercase(),
        body("fullname")
            .trim()
            .notEmpty().withMessage("Full name is required"),
        body("password")
            .notEmpty().withMessage("password is required")
            .bail()
            .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("role")
            .optional().isIn(AvailableUserRoles).withMessage("Invalid role assigned")
    ]
}

export {registerUserValidator};