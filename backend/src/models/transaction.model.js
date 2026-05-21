import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
    {
        
    }
)

export const Transaction = mongoose.model("Transaction", transactionSchema)