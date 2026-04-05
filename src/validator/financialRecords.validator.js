import {body, param, query} from "express-validator";
import { AvailableAmount } from "../utils/constants.js";


const createRecordValidator = () => {
    return[
        body("amount")
            .notEmpty().withMessage("Amount is required")
            .bail()
            .isNumeric().withMessage("Amount must be a number").custom(val => val > 0),
            
            
        body("type")
            .isIn(AvailableAmount).withMessage("Invalid record type")
            .bail(),
        body("category")
            .notEmpty().withMessage("Category is required")
            .trim(),
        body("date")
            .optional().isISO8601().toDate(),
        body("notes")
            .optional()
            .isString().withMessage("notes must be string")
            .bail()
            .isLength({ max: 200 }).withMessage("description can not excedd the length of 200 characters")
]};

const updateRecordValidator = () => {
    return[
        param("id")
            .isMongoId().withMessage("Invalid record ID"),
        body("amount")
            .optional()
            .isNumeric().withMessage("Amount must be a number").custom(val => val > 0),
        body("type")
            .optional()
            .isIn(AvailableAmount).withMessage("Invalid type"),
        body("category")
            .optional()
            .notEmpty()
            .trim(),
        body("date")
            .optional().isISO8601().toDate(),
        body("notes")
            .optional()
            .isString()
            .trim()
            .isLength({ max: 200 }).withMessage("description can not excedd the length of 200 characters"),  
]};

export {createRecordValidator, updateRecordValidator};