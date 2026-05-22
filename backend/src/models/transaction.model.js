import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'INR',
            required: true,
            uppercase: true,
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        paymentGateway: {
            type: String,
            required: true,
            enum: ['stripe', 'paypal', 'razorpay', 'manual']
        },
        gatewayTransactionId: {
            type: String,
            required: true,
            unique: true
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ["UPI", "CARD"]
        },
        failureReason: {
            type: String
        }
    },
    { timestamps: true }
)

export const Transaction = mongoose.model("Transaction", transactionSchema)