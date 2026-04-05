import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { UserRoles } from "../utils/constants.js";
import { getDashboardSummary } from "../controller/dashboard.controller.js";

const dashboardRouter = express.Router();

// Sabhi routes protected hain
dashboardRouter.use(verifyJWT);

//========================================================//
//        1. ACCESS INSIGHTS (Dashboard Summaries)
//         Allowed: Analyst, Admin (Viewer strictly restricted)
//=======================================================//
dashboardRouter.get(
    "/summary",
    // Allow Viewer to enter so they can get "Basic Data"
    authorizeRoles(UserRoles.VIEWER, UserRoles.ANALYST, UserRoles.ADMIN),
    getDashboardSummary
);

export default dashboardRouter;