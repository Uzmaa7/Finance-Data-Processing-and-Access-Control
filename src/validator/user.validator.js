import {body, param} from "express-validator";
import { AvailableUserRoles, AvailableUserStatus } from "../utils/constants.js";

const updateUserValidator = () => {
    return [
        param("id")
            .isMongoId().withMessage("Invalid User ID"),
        body("role")
            .optional()
            .isIn(AvailableUserRoles).withMessage("Invalid role assigned"),
        body("status")
            .optional()
            .isIn(AvailableUserStatus).withMessage("Invalid status assigned"),
        body("fullname")
            .optional()
            .notEmpty(),
    ];
};

const IdValidator = () => {
    return [
        param("id")
            .isMongoId().withMessage("Invalid  ID format. Please provide a valid MongoDB ID.")
    ];
};

export {updateUserValidator, IdValidator};