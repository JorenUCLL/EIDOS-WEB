import { useCallback } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { WebsocketEvent } from "@/types";

export function useWidgetSocket(onNext: () => void, onFunction: (ts: number) => void) {
  const handleMessage = useCallback((data: WebsocketEvent) => {
    if (data.type === "WIDGET") onNext();
    if (data.type === "FUNCTION") onFunction(data.timestamp);
  }, [onNext, onFunction]);

  useWebSocket<WebsocketEvent, { type: "WIDGET"; data: string }>(
    "ws://localhost:8765",
    handleMessage,
  );
}