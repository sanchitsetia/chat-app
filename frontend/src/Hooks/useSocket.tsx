import React, { createContext, useCallback, useRef } from "react";
import useStore from "../zustand/useStore";

// let wsc: WebSocket | null = null;
const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ url, children }: any) => {
  const [isConnected, setIsConnected] = React.useState(false);
  const wsref = useRef<WebSocket | null>(null);

  React.useEffect(() => {
    if (!wsref.current || !wsref.current.OPEN) {
      wsref.current = new WebSocket(url);
      console.log("new socket created");
    }
    wsref.current.onopen = () => {
      setIsConnected(true);
      console.log("connected");
    };
    wsref.current.onclose = () => {
      setIsConnected(false);
      console.log("disconnected");
    };
  }, []);
  const ws = wsref.current;
  const value = { ws };
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useSocket = () => React.useContext(WebSocketContext);

export default useSocket;
