import { useState, useRef, useEffect, useCallback } from "react";
import widgets from "@/components/widgets";

export function useWidgetIndex() {
  const [widgetIndex, setWidgetIndex] = useState(0);
  const indexRef = useRef(0);

  // Sync from URL only after hydration
  useEffect(() => {
    const sync = async () => {
      const id = new URLSearchParams(window.location.search).get("id");
      if (id) {
        const index = widgets.getById(id);
        indexRef.current = index;
        setWidgetIndex(index);
      }
    }
    sync();
  }, []);

  const advance = useCallback(() => {
    const next = indexRef.current >= widgets.getAll().length - 1 ? 0 : indexRef.current + 1;
    indexRef.current = next;

    const params = new URLSearchParams(window.location.search);
    params.set("id", widgets.getAll()[next].id);
    window.history.replaceState(null, "", `?${params.toString()}`);

    setWidgetIndex(next);
  }, []);

  return { widgetIndex, advance };
}