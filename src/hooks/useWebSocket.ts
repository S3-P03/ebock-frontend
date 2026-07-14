import { useEffect, useRef } from "react";

export default function useWebSocket(url: string, onMessage: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => console.log("WS connected");
    ws.onmessage = (event) => onMessage(JSON.parse(event.data));
    ws.onerror = (err) => console.error("WS error", err);
    ws.onclose = () => console.log("WS disconnected");

    wsRef.current = ws;
    return () => ws.close();
  }, [url]);

  return wsRef;
}