require('dotenv-defaults').config();
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: process.env.CLIENT_URL
    }
});

server.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT} 🚀`);
});

io.use((socket, next) => {
    const { uid, username } = socket.handshake.auth;
    socket.uid = uid;
    socket.username = username;
    next();
});

io.on("connection", (socket) => {
    const users = [];

    for(const [id, socket] of io.of("/").sockets) {
        users.push({
            username: socket.username,
            uid: socket.uid
        });
    }

    io.emit("users", users);
});