"use client";
import { useState, useCallback, ComponentType } from "react";
import { Button } from "@/components/ui/button";
import widgets from "@/components/widgets";
import { useWidgetIndex } from "@/hooks/useWidgetIndex";
import { useWidgetSocket } from "@/hooks/useWidgetSocket";
import Status from "@/components/status";
import {
  Circle,
  CircleAlert,
  CircleCheck,
  CircleX,
  LayoutDashboard,
  LucideProps,
} from "lucide-react";

export default function Home() {
  const { widgetIndex, advance } = useWidgetIndex();
  const [widgetMessage, setWidgetMessage] = useState<number>(0);

  const handleNext = useCallback(() => {
    advance();
    setWidgetMessage(0);
  }, [advance]);

  const handleFunction = useCallback((ts: number) => {
    setWidgetMessage(ts);
  }, []);

  const { status } = useWidgetSocket(handleNext, handleFunction);

  const getStatusColor = (
    message: "connecting" | "connected" | "disconnected" | "failed",
  ): "success" | "warning" | "danger" | "neutral" | "info" => {
    switch (message) {
      case "connecting":
        return "info";
      case "connected":
        return "success";
      case "disconnected":
        return "warning";
      default:
        return "danger";
    }
  };

  const getStatusIcon = (
    message: "connecting" | "connected" | "disconnected" | "failed",
  ): ComponentType<LucideProps> | "loading" | null => {
    switch (message) {
      case "connecting":
        return "loading";
      case "connected":
        return CircleCheck;
      case "disconnected":
        return CircleAlert;
      default:
        return CircleX;
    }
  };

  const Widget = widgets.getAll()[widgetIndex];

  return (
    <main className="min-h-screen p-10">
      <Widget.widget message={widgetMessage} />
      <div className="flex gap-3 absolute top-10 right-10">
        <Status
          description={status}
          Icon={getStatusIcon(status)}
          variant={getStatusColor(status)}
          location="bottom"
        />
        <Button onClick={handleNext} variant="glass">
          <LayoutDashboard />
          Next Widget
        </Button>
      </div>
    </main>
  );
}
