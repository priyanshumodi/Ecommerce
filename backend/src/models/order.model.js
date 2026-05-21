import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: [1, "please enter valid quantity"]
        },
        totalPrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: ['PENDING', 'CONFIRMED' ,'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
            default: 'CONFIRMED'
        }
    },{
        timestamps: true
    }
)

orderSchema.pre('save', async function() {
    const product = await mongoose.model('Product').findById(this.productId);

    if(!product) {
        throw new Error('product not found')
    }

    this.totalPrice = this.quantity * product.price;
})

export const Order = mongoose.model("Order", orderSchema)