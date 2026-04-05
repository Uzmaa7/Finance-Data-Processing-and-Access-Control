import {ApiResponse} from "../utils/ApiResponse.js";
import {getDashboardSummaryService} from "../service/dashboard.service.js";
import { UserRoles } from "../utils/constants.js";
import {asyncHandler} from "../utils/asyncHandler.js";


const getDashboardSummary = asyncHandler(async (req, res) => {
    
    const summaryArray = await getDashboardSummaryService(req.user._id);

    let summary = summaryArray[0] || { totalIncome: 0, totalExpense: 0, netBalance: 0 };

    // 2. Logic Check: If the user is only a VIEWER, remove the "Insights, they ONLY get basic totals"
    if (req.user.role === UserRoles.VIEWER) {
        // We pick only what the viewer is allowed to see
        const basicDashboard = {
            totalIncome: summary.totalIncome,
            totalExpense: summary.totalExpense,
            netBalance: summary.netBalance,
            recentActivity: summary.recentActivity || []
        };
        
        return res.status(200).json(
            new ApiResponse(
                200, 
                basicDashboard, 
                "Basic Dashboard retrieved (Insights restricted for Viewer role)"
            )
        );
    }
    // 3. Analysts and Admins get everything

    return res.status(200).json(
        new ApiResponse(
            200,
            summary,
            "Dashboard summary retrieved successfully"
        )
    );
});

export { getDashboardSummary };