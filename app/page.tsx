"use client";
import { Button } from "@/components/ui/button";
import widgets from "@/components/widgets";
import { useWebSocket } from "@/hooks/useWebSocket";
import { WebsocketEvent } from "@/types";
import { useState, useEffect, useCallback } from "react";

export default function Home() {
  const [widgetIndex, setWidgetIndex] = useState<number>(0);
  const [widgetMessage, setWidgetMessage] = useState<number | null>(null);

  useEffect(() => {
    async function getUrlParameter() {
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id");
      if (id) {
        setWidgetIndex(widgets.getById(id));
      }
    }

    getUrlParameter();
  }, []);

  const nextWidget = useCallback(() => {
    const nextIndex =
      widgets.getAll().length - 1 <= widgetIndex ? 0 : widgetIndex + 1;
    setWidgetIndex(nextIndex);
    setWidgetMessage(null);
    const params = new URLSearchParams(window.location.search);
    params.set("id", widgets.getAll()[nextIndex].id);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [widgetIndex]);

  const handleMessage = useCallback(
    (data: WebsocketEvent) => {
      switch (data.type) {
        case "WIDGET":
          nextWidget();
          break;
        case "FUNCTION":
          setWidgetMessage(data.timestamp);
          break;
      }
    },
    [nextWidget],
  );

  const { send } = useWebSocket<
    WebsocketEvent,
    { type: "WIDGET"; data: string }
  >("ws://localhost:8765", handleMessage);

  const Widget = widgets.getAll()[widgetIndex];

  return (
    <main className="min-h-screen p-10">
      <Widget.widget message={widgetMessage} />
      <Button onClick={nextWidget} className="absolute top-10 left-10">
        Next Widget
      </Button>
    </main>
  );
}
