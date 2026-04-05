import FinancialRecords from "../model/financialRecords.model.js";
import mongoose from "mongoose";

const getDashboardSummaryService = async (userId) => {
    return await FinancialRecords.aggregate([
        // Step 1: Filter active records for this user
        { 
            $match: { 
                userId: new mongoose.Types.ObjectId(userId), 
                isDeleted: false 
            } 
        },

        // Step 2: Facet allows us to run multiple pipelines in one go
        {
            $facet: {
                // A. Overall Totals
                stats: [
                    {
                        $group: {
                            _id: "$type",
                            total: {
                                $sum: "$amount"
                            }
                        }
                    }
                ],
                // B. Category Breakdown
                categoryTotals: [
                    {
                        $group: {
                            _id: { type: "$type", category: "$category" },
                            totalAmount: {
                                $sum: "$amount" 
                            }
                        }
                    },
                    { $sort: { totalAmount: -1 } }
                ],
                // C. Weekly/Monthly Trends
                trends: [
                    {
                        $group: {
                            _id: {
                                year: { $year: "$date" },
                                month: { $month: "$date" },
                                type: "$type"
                            },
                            monthlySum: { $sum: "$amount" }
                        }
                    },
                    { $sort: { "_id.year": -1, "_id.month": -1 } },
                    { $limit: 12 } // Last 12 entries for chart
                ],
                // D. Recent Activity
                recentActivity: [
                    { $sort: { date: -1 } }, // Get newest first
                    { $limit: 5 },           // Just the top 5
                    { $project: { userId: 0, isDeleted: 0 } }
                ]
            }
        },

        // Step 3: Final data shaping (Add Net Balance)
        {
            $project: {
                categoryTotals: 1,
                trends: 1,
                recentActivity: 1,
                income: {
                    $arrayElemAt: [{ $filter: { input: "$stats", as: "s", cond: { $eq: ["$$s._id", "INCOME"] } } }, 0]
                },
                expense: {
                    $arrayElemAt: [{ $filter: { input: "$stats", as: "s", cond: { $eq: ["$$s._id", "EXPENSE"] } } }, 0]
                }
            }
        },
        {
            $addFields: {
                totalIncome: { $ifNull: ["$income.total", 0] },
                totalExpense: { $ifNull: ["$expense.total", 0] },
                netBalance: { $subtract: [{ $ifNull: ["$income.total", 0] }, { $ifNull: ["$expense.total", 0] }] }
            }
        },
        { $project: { income: 0, expense: 0 } }
    ]);
};

export {getDashboardSummaryService}