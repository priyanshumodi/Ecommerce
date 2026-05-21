import { Message } from "../models/message.model.js";
import { ApiResponse } from "../utilities/ApiResponse.js";

const getChatHistory = async (req, res) => {
    try {
        const senderId = req.user._id;
        const { receiverId } = req.params;

        if (receiverId === 'GLOBAL_BROADCAST') {
            const roomId = 'GLOBAL_BROADCAST';
            const messages = await Message.find({ roomId })
                .sort({ createdAt: 1 })
            res.status(200).json(new ApiResponse(200, messages, "announcement have come successfully"))
        } else {
            // Ensure roomId is always generated the same way
            const roomId = [senderId.toString(), receiverId.toString()].sort().join("_");
            // console.log(roomId)

            const messages = await Message.find({ roomId })
                .sort({ createdAt: 1 }) // Oldest first
            // .populate("senderId", "firstName lastName")
            // .populate("receiverId", "firstName lastName");

            // res.status(200).json(messages);
            res.status(200).json(new ApiResponse(200, messages, "message have come successfully"))
        }
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Error saving message", error });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;
        if (senderId == receiverId) {
            const roomId = 'GLOBAL_BROADCAST';

            const newMessage = await Message.create({
                senderId: senderId,
                receiverId: receiverId,
                text,
                roomId
            });
            res.status(201).json(newMessage);
        } else {
            const roomId = [senderId, receiverId].sort().join("_");

            const newMessage = await Message.create({
                senderId: senderId,
                receiverId: receiverId,
                text,
                roomId
            });
            res.status(201).json(newMessage);
        }
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: "Error saving message", error });
    }
};

export {
    getChatHistory,
    sendMessage
}