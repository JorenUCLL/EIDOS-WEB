"use client";
import { Button } from "@/components/ui/button";
import widgets from "@/components/widgets";
import { useState, useEffect } from "react";

export default function Home() {
  const [widgetIndex, setWidgetIndex] = useState<number>(0);

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

  const nextWidget = () => {
    const nextIndex =
      widgets.getAll().length - 1 <= widgetIndex ? 0 : widgetIndex + 1;
    setWidgetIndex(nextIndex);
    const params = new URLSearchParams(window.location.search);
    params.set("id", widgets.getAll()[nextIndex].id);
    window.history.replaceState(null, "", `?${params.toString()}`);
  };

  const Widget = widgets.getAll()[widgetIndex];

  return (
    <main className="min-h-screen p-10">
      <Widget.widget />
      <Button onClick={nextWidget} className="absolute top-10 left-10">
        Next Widget
      </Button>
    </main>
  );
}
