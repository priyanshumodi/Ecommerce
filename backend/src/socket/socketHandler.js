import { Message } from "../models/message.model.js";

export const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket Connected:", socket.id);

        socket.on("join_chat", ({ senderId, receiverId }) => {
            console.log(senderId, receiverId)
            const roomId = [senderId, receiverId].sort().join("_");
            socket.join(roomId);
            console.log(`User joined private room: ${roomId}`);
        });



        socket.on("send_admin_broadcast", async (data) => {
            const { senderId, text, roomId } = data;
            try {
                // Save to Database marked as Global
                const globalMessage = await Message.create({
                    senderId: senderId,
                    receiverId: senderId,
                    text,
                    roomId: roomId
                });

                // Blasts out to EVERY single user phone connected right now
                io.emit("receive_global_message", globalMessage);
            } catch (err) { console.error(err); }
        });

        console.log('hey')
        socket.on("send_message", async (data) => {
            const { senderId, receiverId, text } = data;
            const roomId = [senderId, receiverId].sort().join("_");

            console.log(senderId, receiverId, roomId, text)

            try {
                // Save to MongoDB
                const newMessage = await Message.create({
                    senderId: senderId,
                    receiverId: receiverId,
                    text,
                    roomId
                });

                // Emit to the room (both sender and receiver)
                console.log("✅ Saved Successfully:", newMessage);
                io.to(roomId).emit("receive_message", newMessage);

                console.log(`Message sent in room ${roomId}`);
            } catch (err) {
                console.error("Socket Message Error:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};