"use client";

import Status from "@/components/status";
import { Spinner } from "@/components/ui/spinner";
import widgets from "@/components/widgets";
import { useState } from "react";

export default function Home() {
  const [widgetIndex, setWidgetIndex] = useState<number>(0);
  const Widget = widgets[widgetIndex];

  const nextWidget = () => {
    const nextIndex = widgets.length - 1 <= widgetIndex ? 0 : widgetIndex + 1;
    setWidgetIndex(nextIndex);
  };

  return (
    <main className="min-h-screen px-10 py-7">
      <Widget.widget />
      <button onClick={nextWidget} className="absolute top-10 left-10">
        Next Widget
      </button>
    </main>
  );
}
