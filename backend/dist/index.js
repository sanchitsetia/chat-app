"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let socketMap = {};
wss.on("connection", (socket) => {
    console.log("new connection");
    socket.on("message", (message) => {
        console.log(message.toString());
        try {
            const parsedMessage = JSON.parse(message.toString());
            if (parsedMessage.type === "create") {
                const roomId = generateRoomId(6);
                socketMap[roomId] = [{ socket, username: parsedMessage.payload.username }];
                socket.send(JSON.stringify({ type: "created", roomId }));
            }
            else if (parsedMessage.type === "join") {
                socketMap[parsedMessage.payload.roomId].push({ socket, username: parsedMessage.payload.username });
                socket.send(JSON.stringify({ type: "joined" }));
            }
            else if (parsedMessage.type === "chat") {
                console.log(socketMap[parsedMessage.payload.roomId]);
                console.log(socketMap[parsedMessage.payload.roomId].includes({ socket, username: parsedMessage.payload.username }));
                if (socketMap[parsedMessage.payload.roomId]) {
                    socketMap[parsedMessage.payload.roomId].forEach((user) => {
                        if (user.socket !== socket) {
                            user.socket.send(JSON.stringify({ "type": "chat", "message": parsedMessage.payload.message }));
                        }
                    });
                }
            }
        }
        catch (error) {
            console.log(error);
            socket.send(JSON.stringify({ type: "error", message: "invalid message" }));
        }
    });
});
const generateRoomId = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
