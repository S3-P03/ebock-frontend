import { useEffect, useRef } from "react";
import useAuthSession from "./useAuthSession";
import apiClient from "services/apiClient";
import { WsTokenResponse } from "interfaces/Message";

async function fetchWsToken(token: string) {
  const response = await apiClient.post<WsTokenResponse>("/ws-token", {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data.token;
}

export default function useWebSocket(url: string, onMessage: (data: any) => void) {
  const { token } = useAuthSession();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if(!token) return;

    fetchWsToken(token).then((wsToken) => {
      const ws = new WebSocket(`${url}?wsToken=${encodeURIComponent(wsToken)}`);
      ws.onopen = () => console.log("WS connected");
      ws.onmessage = (event) => onMessage(JSON.parse(event.data));
      ws.onerror = (err) => console.error("WS error", err);
      ws.onclose = () => console.log("WS disconnected");

      wsRef.current = ws;
    });

    return () => wsRef.current?.close();
  }, [url, token]);

  return wsRef;
}