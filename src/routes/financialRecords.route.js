import express from "express";
import { UserRoles } from "../utils/constants.js";
import {verifyJWT} from "../middleware/auth.middleware.js";
import {authorizeRoles} from "../middleware/role.middleware.js";
import {validate} from "../middleware/validator.middleware.js";
import { createRecordValidator, updateRecordValidator } from "../validator/financialRecords.validator.js";
import { createRecord, updateRecord, deleteRecord } from "../controller/financialRecords.controller.js";
import { IdValidator } from "../validator/user.validator.js";

const financialRecordsRouter = express.Router();

financialRecordsRouter.use(verifyJWT);
//========================================================//
//        1. VIEW RECORDS (Basic Dashboard Data)
//          Allowed: Viewer, Analyst, Admin  
//=======================================================// 
financialRecordsRouter.get(
    "/",
    authorizeRoles(UserRoles.VIEWER, UserRoles.ANALYST, UserRoles.ADMIN),
    getRecords
);

//========================================================//
//        2. ACCESS INSIGHTS (Dashboard Summaries)
//         Allowed: Analyst, Admin (Viewer strictly restricted)
//=======================================================//
financialRecordsRouter.get(
    "/summary", 
    authorizeRoles(UserRoles.ANALYST, UserRoles.ADMIN), 
    getSummary
);

//========================================================//
//       3. CREATE & MODIFY (Full Management Access)
//        Allowed: Admin Only (Viewer & Analyst strictly restricted)
//=======================================================//

financialRecordsRouter.post(
    "/", 
    authorizeRoles(UserRoles.ADMIN), 
    createRecordValidator(),
    validate,
    createRecord
);

financialRecordsRouter.patch(
    "/:id", 
    authorizeRoles(UserRoles.ADMIN),
    updateRecordValidator(),
    validate,
    updateRecord
);

financialRecordsRouter.delete(
    "/:id", 
    authorizeRoles(UserRoles.ADMIN), 
    IdValidator(),
    validate,
    deleteRecord
);


export default financialRecordsRouter;