"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import widgets from "@/components/widgets";
import { useWidgetIndex } from "@/hooks/useWidgetIndex";
import { useWidgetSocket } from "@/hooks/useWidgetSocket";

export default function Home() {
  const { widgetIndex, advance } = useWidgetIndex();
  const [widgetMessage, setWidgetMessage] = useState<number | null>(null);

  const handleNext = useCallback(() => {
    advance();
    setWidgetMessage(null);
  }, [advance]);

  const handleFunction = useCallback((ts: number) => {
    setWidgetMessage(ts);
  }, []);

  useWidgetSocket(handleNext, handleFunction);

  const Widget = widgets.getAll()[widgetIndex];

  return (
    <main className="min-h-screen p-10">
      <Widget.widget message={widgetMessage} />
      <Button onClick={handleNext} className="absolute top-10 left-10">
        Next Widget
      </Button>
    </main>
  );
}
