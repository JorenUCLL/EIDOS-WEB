"use client";
import { Button } from "../ui/button";
import { useText } from "@/hooks/useText";
import { useMap } from "@/hooks/useMap";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card } from "../ui/card";
import { Locate, MapPin } from "lucide-react";

export default function TextWidget({ message }: { message: number | null }) {
  const { mapContainer, coords } = useMap([
    50.84703597928743, 4.726153354995554,
  ]);
  const { send } = useText(message, coords);

  return (
    <section className="flex flex-col gap-16">
      <div className="flex flex-col items-center gap-10">
        <div className="py-10">
          <div className="h-64 w-64 rounded-full bg-primary flex items-center justify-center">
            <h1 className="text-white text-7xl font-bold">SOS</h1>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-8">
        <h1 className="justify-center flex text-5xl font-bold text-white">
          Noodoproep
        </h1>
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-7">
            <Button
              variant="glass-active"
              size="lg"
              className="text-xl text-primary"
              onClick={send}
            >
              Send SOS
            </Button>
          </div>
        </div>
        <Card className="px-4">
          <p className="uppercase flex gap-1 items-center">
            <MapPin size={20} /> Live Location
          </p>
          <div>
            <div
              ref={mapContainer}
              className="rounded-t-lg"
              style={{ width: 400, height: 300 }}
            />
            <div className="rounded-b-lg bg-primary text-white px-2 py-1">
              <p>Address 54</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
