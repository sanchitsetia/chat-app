import React, { useEffect, useRef } from "react";
import useSocket from "../Hooks/useSocket";
import useStore from "../zustand/useStore";

const ChatRoom = () => {
  const roomId = useStore((state) => state.roomId);
  const setRoomId = useStore((state) => state.setRoomId);
  const messageRef = useRef<HTMLInputElement>(null);
  console.log("roomId", roomId);
  const [messages, setMessages] = React.useState<any[]>([]);

  const { ws } = useSocket();

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (event: MessageEvent) => {
      console.log(event.data);
      const parsedMessage = JSON.parse(event.data);
      if (parsedMessage.type === "chat") {
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: parsedMessage.payload.message, isSent: false },
        ]);
      }
    };
  }, [ws]);
  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex flex-col gap-8 justify-between">
        <div className="flex flex-col gap-4 ml-8 mr-8">
          {messages.map((message, index) => (
            <span
              key={index}
              className={`p-4 rounded-lg w-fit ${
                message.isSent ? "bg-green-500 self-end" : "bg-blue-500"
              }`}
            >
              {message.message}
            </span>
          ))}
        </div>
        <div className="p-4 flex gap-2">
          <input
            className="p-2 w-11/12 text-black rounded-lg"
            placeholder="enter youe message"
            ref={messageRef}
          ></input>
          <button
            className="bg-blue-500 rounded-lg p-2 w-1/12"
            onClick={() => {
              ws.send(
                JSON.stringify({
                  type: "chat",
                  payload: {
                    roomId: roomId,
                    message: messageRef.current!.value,
                  },
                })
              );
              setMessages((prevMessages) => [
                ...prevMessages,
                { message: messageRef.current!.value, isSent: true },
              ]);
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
