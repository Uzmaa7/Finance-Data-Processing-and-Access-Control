import {body, param} from "express-validator";

const updateUserValidator = () => {
    return [
        param("id")
            .isMongoId().withMessage("Invalid User ID"),
        body("role")
            .optional()
            .isIn(AvailableUserRoles).withMessage("Invalid role assigned"),,
        body("status")
            .optional()
            .isIn(AvailableUserStatus).withMessage("Invalid status assigned"),
        body("fullname")
            .optional()
            .notEmpty(),
    ];
};

export {updateUserValidator};