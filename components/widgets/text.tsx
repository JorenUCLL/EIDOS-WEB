"use client";
import { Button } from "../ui/button";
import { useText } from "@/hooks/useText";
import { useMap } from "@/hooks/useMap";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "../ui/card";
import { Info, MapPin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import RadialPulseRings from "../radial-pulse-rings";

export default function TextWidget({ message }: { message: number | null }) {
  const { mapContainer, coords, address } = useMap([50.8457274, 4.7283913]);
  const { send, statusMessage, countdown, status } = useText(
    message,
    coords,
    address,
  );

  return (
    <section className="flex flex-col">
      <div className="flex flex-col items-center gap-10">
        <RadialPulseRings size={440} speed={0.9}>
          <div className="h-64 w-64 rounded-full bg-primary flex items-center justify-center">
            <h1 className="text-white text-7xl font-bold">
              {status === "armed" ? countdown : "SOS"}
            </h1>
          </div>
        </RadialPulseRings>
      </div>
      <div className="flex flex-col items-center gap-8">
        {/* <h1 className="justify-center flex text-5xl font-bold text-white">
          {statusMessage}
        </h1> */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-7">
            <Button
              variant="glass-active"
              size="very-big"
              className="text-3xl text-primary font-bold"
              onClick={send}
            >
              {statusMessage}
            </Button>
          </div>
        </div>
        <Card variant="glass" className="px-4 w-fit">
          <div className="w-full flex justify-between items-center">
            <p className="uppercase flex gap-1 items-center">
              <MapPin size={20} /> Live Location
            </p>
            <p className="flex gap-1 items-center text-green-300">
              <span className="text-2xl -my-6 animate-pulse">•</span> Up-to-date
            </p>
          </div>
          <div
            ref={mapContainer}
            className="rounded-lg"
            style={{ width: 400, height: 300 }}
          />
          <Card
            variant="glass-active"
            className=" text-white px-2 py-1 max-w-100 rounded-lg"
          >
            <p className="wrap-break-word flex gap-1 items-center">
              {address ?? "Unknown address"}
              <Tooltip>
                <TooltipTrigger>
                  <Info size={15} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    It is possible that the address is not completely accurate,
                    so always check the coordinates carefully.
                  </p>
                </TooltipContent>
              </Tooltip>
            </p>
          </Card>
        </Card>
      </div>
    </section>
  );
}
