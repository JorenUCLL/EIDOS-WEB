"use client";

import { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import { Widget } from "@/types";

interface Props {
  handleNext: () => void;
  widget: Widget;
  widgets: Widget[];
  goToWidget: (id: string) => void;
}

export default function SelectWidget({
  handleNext,
  widget,
  widgets,
  goToWidget,
}: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="glass">
          <LayoutDashboard />
          Widgets
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Select a widget</SheetTitle>
          <SheetDescription>Select a widget to navigate to it</SheetDescription>
        </SheetHeader>
        <SheetDescription className="px-5 flex flex-col gap-3">
          {widgets.map((widgetList) => {
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
                    widget?.id === widgetList.id ? "glass-active" : "glass"
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
                      <p className="text-white font-bold">{widgetList.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            );
          })}
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}
