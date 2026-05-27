import 'dotenv/config'
import connectDB from './db/index.js'
import { app } from './app.js'

import http from 'http'
import { Server } from 'socket.io'
import { setupSocket } from './socket/socketHandler.js'

// 1. Create HTTP Server
const server = http.createServer(app);

// 2. Initialize Socket.io on the SAME server

const allowedOrigins = ['http://localhost:5173', process.env.CORS_ORIGIN].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins, // Change this from '*' to your exact frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

// 3. Setup Socket Logic
setupSocket(io);

// 4. Start the Server (USE server.listen, NOT app.listen)
connectDB()
    .then(() => {
        const PORT = process.env.PORT
        server.listen(PORT, () => {
            console.log(`server is listening at ${PORT || 8000}`)
        })
        server.on('error', (err) => {
            console.log(`Error: ${err}`);
            throw err;
        })
    })
    .catch((err) => {
        console.log(`MONGODB connection Failed !!! ${err}`);
    })