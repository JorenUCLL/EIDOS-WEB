import { useState, useCallback } from "react";
import widgets from "@/components/widgets";

export function useWidgetIndex() {
  const [widgetIndex, setWidgetIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const id = new URLSearchParams(window.location.search).get("id");
    return id ? widgets.getById(id) : 0;
  });


  const advance = useCallback(() => {
    setWidgetIndex(prev => {
      const next = prev >= widgets.getAll().length - 1 ? 0 : prev + 1;
      const params = new URLSearchParams(window.location.search);
      params.set("id", widgets.getAll()[next].id);
      window.history.replaceState(null, "", `?${params.toString()}`);
      return next;
    });
  }, []);

  return { widgetIndex, advance };
}