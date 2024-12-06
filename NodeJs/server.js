import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { announcementRoutes } from "./Routes/announcement.routes.js";
import { userRoutes } from "./Routes/user.routes.js";
import { eventRoutes } from "./Routes/event.routes.js";
import { resourceRoutes } from "./Routes/resource.routes.js";
import http from "http";
import { Server } from "socket.io";
import { questionRoutes } from "./Routes/questions.routes.js";
import { wishlistRoutes } from "./Routes/wishlist.routes.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://education-community-platform.vercel.app/",
        methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
    },
});
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors({
    origin: "https://education-community-platform.vercel.app/",
    methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
}));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

const dbURI = process.env.MONGO_URI;
// MongoDB connection
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;

db.on("open", () => {
    console.log("Connection Successful");
});

db.on("error", () => {
    console.log("Connection not Successful");
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for messages
    socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message); // Broadcast to all users
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Routes
announcementRoutes(app);
userRoutes(app);
eventRoutes(app);
resourceRoutes(app);
questionRoutes(app);
wishlistRoutes(app);