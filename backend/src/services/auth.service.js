import jwt from "jsonwebtoken";

function setUser(user) {
    const payload = {
        _id: user?._id,
        firstName: user?.firstName,
        email: user?.email
    };
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
}

function getUser(token) {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

export {
    setUser,
    getUser
}