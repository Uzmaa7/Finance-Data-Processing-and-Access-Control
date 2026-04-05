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

const updateRecordService = async (recordId, updateData) => {
    // 1. Define strictly what is allowed to be updated
    const allowedFields = ["amount", "type", "category", "date", "notes"];
    
    // 2. Create a clean update object (Ignore anything else sent in request)
    const filteredUpdate = {};
    allowedFields.forEach((field) => {
        if (updateData[field] !== undefined) {
            filteredUpdate[field] = updateData[field];
        }
    });

    // 3. Optional: Trim notes if they exist
    if (filteredUpdate.notes) filteredUpdate.notes = filteredUpdate.notes.trim();

    // 4. Update the record
    // We search by _id AND ensure isDeleted is false (can't update a deleted record)
    const updatedRecord = await FinancialRecords.findOneAndUpdate(
        { _id: recordId, isDeleted: false },
        { $set: filteredUpdate },
        { 
            new: true,           // Return the modified document
            runValidators: true  // Ensure Mongoose schema rules are checked
        }
    );

    if (!updatedRecord) {
        throw new ApiError(404, "Financial record not found or already deleted");
    }

    return updatedRecord;
};

const deleteRecordService = async (recordId) => {

    const record = await FinancialRecords.findOneAndUpdate(
        { 
            _id: recordId, 
            isDeleted: false // Security/Logic: Only delete if currently active
        },
        { 
            $set: { isDeleted: true } 
        },
        { 
            new: true // Return the updated document
        }
    );

    // 2. If no record was found (either wrong ID or already deleted)
    if (!record) {
        throw new ApiError(404, "Record not found or has already been deleted");
    }

    return record;
}
// const createRecordService = async (userId, data) => {

// }

export {createRecordService, updateRecordService, deleteRecordService}