import { Schema, mongoose } from "mongoose";

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: [0, "price can not be less than 0"]
        },
        image: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity can not be less than 1"]
        },
        category: {
            type: String,
            required: true
        }
    },{
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema)