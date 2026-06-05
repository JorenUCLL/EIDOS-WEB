"use client";
import { useState, useCallback, ComponentType } from "react";
import { Button } from "@/components/ui/button";
import widgets from "@/components/widgets";
import { useWidgetIndex } from "@/hooks/useWidgetIndex";
import { useWidgetSocket } from "@/hooks/useWidgetSocket";
import Status from "@/components/status";
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  LayoutDashboard,
  LucideProps,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
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
      <div className="flex gap-3 absolute top-10 right-10 size">
        <Status
          description={status}
          Icon={getStatusIcon(status)}
          variant={getStatusColor(status)}
        />
        <Sheet>
          <SheetTrigger asChild>
            <Button onClick={handleNext} variant="glass">
              <LayoutDashboard />
              Widgets
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Select a widget</SheetTitle>
              <SheetDescription>
                Select a widget to navigate to it
              </SheetDescription>
            </SheetHeader>
            <SheetDescription className="px-5 flex flex-col gap-3">
              {widgets.getAll().map((widgetList) => {
                return (
                  <button
                    onClick={() => {
                      goToWidget(widgetList.id);
                    }}
                    key={widgetList.id}
                    className="w-full hover:cursor-pointer"
                  >
                    <Card
                      variant={
                        Widget?.id === widgetList.id ? "glass-active" : "glass"
                      }
                      className=" w-full"
                    >
                      <CardContent className="flex gap-2 items-center">
                        {/* <Image
                        src={channelList.imageUrl ?? "/images/radio.png"}
                        alt="Radio image"
                        height={40}
                        width={40}
                        className=" h-10 w-10 object-contain"
                        loading="eager"
                      /> */}
                        <div className="bg-primary rounded-md h-10 w-10 flex justify-center items-center">
                          <widgetList.icon className="text-white" />
                        </div>
                        <div className="">
                          <p className="text-white font-bold">
                            {widgetList.name}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                );
              })}
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    </main>
  );
}
