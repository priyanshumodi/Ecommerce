export const isAdmin = async (req, res, next) => {
    try {
        const user = req?.user;
        if(user?.role !== 'admin') {
            return res.status(403).json({statusCode: 403, message: "Access Denied"})
        }
        next()
    } catch (error) {
        return res.status(500).json({statusCode: 500, message: error?.message || "user not found"})
    }
}