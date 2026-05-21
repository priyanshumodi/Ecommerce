import mongoose, { Schema } from "mongoose";


const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "password is required"]
        },
        age: {
            type: Number,
            min: [0, "can not less than 0"],
            max: [120, "purane chaval"]
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'non-binary', 'prefer not to say', 'other'],
            lowercase: true,
            trim: true
        },
        role: {
            type: String,
            required:true,
            enum: ['user', 'admin'],
            default: 'user'
        }
    },{
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema);