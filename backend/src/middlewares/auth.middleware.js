import { User } from "../models/user.model.js"
import { getUser } from "../services/auth.service.js"

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        // const token = req.header("Authorization")?.replace("Bearer ","");

        if(!token) {
            // throw new ApiError(401, "User is not logged in")
            return res.status(401).json({statusCode: 401, message: "unAuthorized user"})
        }

        const decodedToken = getUser(token)
        // console.log(decodedToken)

        const user = await User.findById(decodedToken?._id);

        if(!user) {
            // throw new ApiError(401, "Invalid access token")
            return res.status(401).json({statusCode: 401, message: "Invalid access Token"})
        }

        req.user = user;
        next()
    } catch (error) {
        // throw new ApiError(401, error?.message || "invalid access token")
        return res.status(401).json({statusCode: 401, message: error?.message || "token not found"})
    }
}