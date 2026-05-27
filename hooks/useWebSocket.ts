import { useEffect, useRef, useCallback } from 'react';

export function useWebSocket<TReceive, TSend = TReceive>(
  url: string,
  onMessage: (data: TReceive) => void
) {
  const ws = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onmessage = (event: MessageEvent<string>) => {
      const data = JSON.parse(event.data) as TReceive;
      onMessageRef.current(data);
    };
    return () => ws.current?.close();
  }, [url]);

  const send = useCallback((message: TSend) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  return { send };
}