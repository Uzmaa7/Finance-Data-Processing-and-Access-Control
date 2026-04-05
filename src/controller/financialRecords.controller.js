import {ApiResponse} from "../utils/ApiResponse.js";
import { createRecordService, updateRecordService } from "../service/financialRecords.service.js";

const createRecord = asyncHandler(async (req, res) => {

    const data = req.body;

    const record = await createRecordService(req.user._id, data);

    res.status(201).json(new ApiResponse(201, record, "Record created successfully"));
});

const updateRecord = asyncHandler(async (req, res) => {

    const {id} = req.params;
    const data = req.body;

    const record = await updateRecordService(id, data);
    res.status(200).json(new ApiResponse(200, record, "Record updated successfully"));
});

export {createRecord, updateRecord};