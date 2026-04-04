import mongoose from "mongoose";
import { AvailableAmount } from "../utils/constants";

const financialRecordsSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },

    amount: {
        type: Number,
        required: [true,"Amount is required"],
    },

    type: {
        type: String,
        enum: AvailableAmount,
        required: true,
        index: true
    },

    category: {
        type: String,
        required: true,
        index: true,
    },

    date: {
        type: Date,
        default: Date.now,
        index: true,
    },

    notes: {
        type: String,
        trim: true,
    },

    isDeleted: {
       type: Boolean,
       default: false,
       index: true 
    },

},{timestamps:true})

// COMPOUND INDEXING for Performance
// 1. Dashboard filters (User + Type + Category)
financialRecordsSchema.index({ userId: 1, type: 1, category: 1, isDeleted: 1 });

// 2. Recent Transactions & Pagination
financialRecordsSchema.index({ userId: 1, date: -1, isDeleted: 1 });

// TEXT INDEX for Search functionality on Notes
financialRecordsSchema.index({ notes: "text" });


const FinancialRecords = mongoose.model("FinancialRecords", financialRecordsSchema);

export default FinancialRecords;