import { Router } from "express";
import {
    getChatHistory,
    sendMessage
} from "../controllers/message.controller.js"

const router = Router();

router.get("/:receiverId", getChatHistory);

router.post("/", sendMessage);

export default router;