import { useEffect, useRef, useCallback } from 'react';

interface UseWebSocketOptions {
  maxRetries?: number;
  retryInterval?: number;
}

export function useWebSocket<TReceive, TSend = TReceive>(
  url: string,
  onMessage: (data: TReceive) => void,
  options: UseWebSocketOptions = {}
) {
  const { maxRetries = 900000, retryInterval = 3000 } = options;

  const ws = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);
  const retryCount = useRef(0);
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isManuallyClosed = useRef(false);
  const connectRef = useRef<() => void>(() => { });

  const log = useCallback((message: string, ...args: unknown[]) => {
    console.log(`[WebSocket] ${message}`, ...args);
  }, []);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    log(`Connecting to ${url}…`);
    ws.current = new WebSocket(url);

    ws.current.onmessage = (event: MessageEvent<string>) => {
      const data = JSON.parse(event.data) as TReceive;
      log('Message received', data);
      onMessageRef.current(data);
    };

    ws.current.onopen = () => {
      log(`Connected${retryCount.current > 0 ? ` (after ${retryCount.current} retries)` : ''}`);
      retryCount.current = 0;
    };

    ws.current.onclose = (event: CloseEvent) => {
      log(`Connection closed — code: ${event.code}, reason: ${event.reason || '(none)'}, clean: ${event.wasClean}`);

      if (isManuallyClosed.current) {
        log('Closed intentionally, not reconnecting');
        return;
      }
      if (retryCount.current >= maxRetries) {
        log(`Max retries (${maxRetries}) reached, giving up`);
        return;
      }

      retryCount.current += 1;
      log(`Reconnect attempt ${retryCount.current}/${maxRetries} in ${retryInterval}ms…`);
      retryTimeout.current = setTimeout(() => connectRef.current(), retryInterval);
    };

    ws.current.onerror = (event: Event) => {
      log('Error', event);
    };
  }, [url, maxRetries, retryInterval, log]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    isManuallyClosed.current = false;
    connect();

    return () => {
      log('Cleaning up — closing connection');
      isManuallyClosed.current = true;
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
      ws.current?.close();
    };
  }, [connect, log]);

  const send = useCallback((message: TSend) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      log('Sending message', message);
      ws.current.send(JSON.stringify(message));
    } else {
      log('Send skipped — socket not open (readyState:', ws.current?.readyState, ')');
    }
  }, [log]);

  return { send };
}