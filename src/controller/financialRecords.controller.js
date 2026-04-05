import {ApiResponse} from "../utils/ApiResponse.js";
import { createRecordService } from "../service/financialRecords.service.js";

const createRecord = asyncHandler(async (req, res) => {

    const data = req.body;

    const record = await createRecordService(req.user._id, data);

    res.status(201).json(new ApiResponse(201, record, "Record created successfully"));
});



export {createRecord};