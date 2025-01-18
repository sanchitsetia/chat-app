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
            let parsedMessage = JSON.parse(message.toString());
            if (parsedMessage.type === "create") {
                console.log("create room before");
                const roomId = generateRoomId(6);
                socketMap[roomId] = [{ socket, username: parsedMessage.payload.username }];
                socket.send(JSON.stringify({ type: "created", roomId }));
                console.log("room created");
            }
            else if (parsedMessage.type === "join") {
                socketMap[parsedMessage.payload.roomId].push({ socket, username: parsedMessage.payload.username });
                socket.send(JSON.stringify({ type: "joined", roomId: parsedMessage.payload.roomId }));
            }
            else if (parsedMessage.type === "chat") {
                console.log("yoyoyo", socketMap[parsedMessage.payload.roomId]);
                console.log("chat message");
                if (socketMap[parsedMessage.payload.roomId]) {
                    socketMap[parsedMessage.payload.roomId].forEach((user) => {
                        console.log("user", user);
                        if (user.socket !== socket) {
                            user.socket.send(JSON.stringify({ "type": "chat", payload: { message: parsedMessage.payload.message, roomId: parsedMessage.payload.roomId } }));
                            console.log("message sent back to user");
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
