import { useEffect, useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import CreateRoom from "./components/CreateRoom";
import JoinRoom from "./components/JoinRoom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatRoom from "./components/ChatRoom";
import { WebSocketProvider } from "./Hooks/useSocket";

function App() {
  return (
    <div className="bg-black text-white w-screen h-screen">
      <BrowserRouter>
        <WebSocketProvider url="ws://localhost:8080">
          <Routes>
            <Route path="/" element={<CreateRoom />} />
            <Route path="/join" element={<JoinRoom />} />
            <Route path="/room" element={<ChatRoom />} />
          </Routes>
        </WebSocketProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
