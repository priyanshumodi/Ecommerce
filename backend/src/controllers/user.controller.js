import { User } from "../models/user.model.js";
import { setUser } from "../services/auth.service.js";
import { ApiResponse } from "../utilities/ApiResponse.js";

const helloUser = async (req, res) => {
    return res.status(200).json(new ApiResponse(200, {}, "Ha shi chal rha hai"));
}

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, age, gender, role } = req.body;

        console.log(firstName, lastName, email, password, age, gender, role)

        if (([firstName, lastName, email, password, gender, role].some((field) => field?.trim() === '')) || !age) {
            return res.status(400).json({ message: "All field are required" });
        }

        const existedUser = await User.findOne({ email });

        if (existedUser) {
            return res.status(409).json({ message: "User already exist" });
        }

        const userCreated = await User.create(
            { firstName, lastName, email, password, age, gender, role }
        )

        const user = await User.findById(userCreated.id).select("-password");

        return res.status(200).json(new ApiResponse(200, user, "user registration succefully"))
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(email, password)

        if ([email, password].some((field) => field?.trim() === '')) {
            return res.status(400).json({ message: "All field are required" });
        }

        const existedUser = await User.findOne({ email });

        if (!existedUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isPasswordValid = existedUser.password === password;

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = await User.findById(existedUser.id).select("-password");

        const accessToken = setUser(user)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, { user, accessToken }, "user login successfully"));
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

const logoutUser = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: true
        }
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .json(new ApiResponse(200, {}, "user logged out"))
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: error.message })
    }
}

const currentUser = async (req, res) => {
    try {
        return res
            .status(200)
            .json(new ApiResponse(200, req.user, "current user fetched..."))
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: error.message })
    }
}

const getAllUser = async (req, res) => {
    try {
        const allUsers = await User.find()
        if (!allUsers) {
            return res.status(404).json({ statusCode: 404, message: "not found" })
        }
        console.log(allUsers)
        return res
            .status(200)
            .json(new ApiResponse(200, allUsers, "all user fetched..."))
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: error.message })
    }
}

const getUsersChats = async (req, res) => {
    try {
        const userId = req.user?._id;
        const allUsers = await User.find({ _id: { $ne: userId } }).select('_id firstName lastName role');

        if (!allUsers) {
            return res.status(404).json({ statusCode: 404, message: "not found" })
        }
        console.log(allUsers)
        return res
            .status(200)
            .json(new ApiResponse(200, allUsers, "all user fetched..."))
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: error.message })
    }
}


export {
    getAllUser,
    registerUser,
    loginUser,
    logoutUser,
    helloUser,
    currentUser,
    getUsersChats
}