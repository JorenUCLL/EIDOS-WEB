import { useCallback } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { WebsocketEvent } from "@/types";

export function useWidgetSocket(onNext: () => void, onFunction: (ts: number) => void) {
  const handleMessage = useCallback((data: WebsocketEvent) => {
    if (data.type === "WIDGET") onNext();
    if (data.type === "FUNCTION") onFunction(Date.now());
  }, [onNext, onFunction]);

  const { send, status } = useWebSocket<WebsocketEvent, { type: "WIDGET"; data: string }>(
    process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "ws://localhost:8765",
    handleMessage,
  );

  return { send, status };
}