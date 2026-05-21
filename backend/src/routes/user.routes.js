import { Router } from "express";
import {
    loginUser,
    registerUser,
    logoutUser,
    helloUser,
    currentUser,
    getAllUser,
    getUsersChats
} from '../controllers/user.controller.js'
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/adminAuth.middleware.js";

const router = Router();

router.route('/').get(helloUser)

router.route('/admin/getAllUser').get(verifyJWT, isAdmin, getAllUser)

router.route('/chat').get(verifyJWT, getUsersChats)

router.route('/login').post(loginUser)

router.route('/logout').post(verifyJWT, logoutUser)

router.route('/register').post(registerUser)

router.route('/current-user').post(verifyJWT, currentUser)

export default router;