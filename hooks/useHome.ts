"use client";
import { useState, useCallback, ComponentType } from "react";
import widgets from "@/components/widgets";
import { useWidgetIndex } from "@/hooks/useWidgetIndex";
import { useWidgetSocket } from "@/hooks/useWidgetSocket";
import { CircleAlert, CircleCheck, CircleX, LucideProps } from "lucide-react";

type SocketStatus = "connecting" | "connected" | "disconnected" | "failed";
type StatusVariant = "success" | "warning" | "danger" | "neutral" | "info";
type StatusIcon = ComponentType<LucideProps> | "loading" | null;

const STATUS_COLOR_MAP: Record<SocketStatus, StatusVariant> = {
  connecting: "info",
  connected: "success",
  disconnected: "warning",
  failed: "danger",
};

const STATUS_ICON_MAP: Record<SocketStatus, StatusIcon> = {
  connecting: "loading",
  connected: CircleCheck,
  disconnected: CircleAlert,
  failed: CircleX,
};

export function useHome() {
  const { widgetIndex, advance, goToWidget } = useWidgetIndex();
  const [widgetMessage, setWidgetMessage] = useState<number>(0);

  const handleNext = useCallback(() => {
    advance();
    setWidgetMessage(0);
  }, [advance]);

  const handleFunction = useCallback((ts: number) => {
    setWidgetMessage(ts);
  }, []);

  const { status } = useWidgetSocket(handleNext, handleFunction);

  const Widget = widgets.getAll()[widgetIndex];
  const allWidgets = widgets.getAll();
  const statusVariant = STATUS_COLOR_MAP[status];
  const statusIcon = STATUS_ICON_MAP[status];

  return {
    Widget,
    allWidgets,
    widgetMessage,
    status,
    statusVariant,
    statusIcon,
    handleNext,
    goToWidget,
  };
}