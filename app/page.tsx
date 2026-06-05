"use client";
import { useHome } from "@/hooks/useHome";
import Status from "@/components/status";
import SelectWidget from "@/components/select-widget";

export default function Home() {
  const {
    Widget,
    allWidgets,
    widgetMessage,
    status,
    statusVariant,
    statusIcon,
    handleNext,
    goToWidget,
  } = useHome();

  return (
    <main className="min-h-screen p-10">
      <Widget.widget message={widgetMessage} />
      <div className="flex gap-3 absolute top-10 right-10 size">
        <Status
          description={status}
          Icon={statusIcon}
          variant={statusVariant}
        />
        <SelectWidget
          handleNext={handleNext}
          widget={Widget}
          widgets={allWidgets}
          goToWidget={goToWidget}
        />
      </div>
    </main>
  );
}
