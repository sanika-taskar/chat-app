import express from 'express';
import "dotenv/config.js";
import cors from 'cors';
import http from 'http';
import { connectDb } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from "socket.io";
import user from './models/User.js';

const app = express();
const server = http.createServer(app);

//initialize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" }
})

//store online users
export const userSocketMap = {};

//socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);

    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })

})
//middleware setup

app.use(express.json({ limit: "10mb" }));
app.use(cors());

//route setup
app.use("/api/status", (req, res) => res.send("server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter)

//connect to mongodb

await connectDb();

if (process.env.NODE_ENV !== "Production") {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log("server is running on the port " + PORT);
    });
}

//export server for vercel
export default server