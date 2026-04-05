import FinancialRecords from "../model/financialRecords.model.js";
import {ApiError} from "../utils/ApiError.js";

const createRecordService = async (userId, data) => {

    const {amount, type, category, notes, date} = data;

    const cleanRecord = {
        userId, 
        amount,
        type,
        category,
        date: date || Date.now(),
        notes: notes?.trim(),
        isDeleted: false 
    };

    const record =  await FinancialRecords.create(cleanRecord);
    if(!record) throw new ApiError(500, "Failed to create record");

    return record;
}

// const createRecordService = async (userId, data) => {

// }
// const createRecordService = async (userId, data) => {

// }
// const createRecordService = async (userId, data) => {

// }

export {createRecordService}