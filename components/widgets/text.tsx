"use client";

import Image from "next/image";
import Status from "../status";
import { Button } from "../ui/button";
import { useRadio } from "@/hooks/useRadio";
import channels from "@/lib/radio";
import { Card, CardContent } from "../ui/card";
import { ChevronFirst, ChevronLast } from "lucide-react";
import RadialBarsKnob from "../animated-circle";
import { useText } from "@/hooks/useText";

export default function TextWidget({ message }: { message: number | null }) {
  const { send, statusMessage, status } = useText(message);

  return (
    <section className="flex flex-col gap-16">
      <div className="flex flex-col items-center gap-10 ">
        {/* <RadialBarsKnob size={440} speed={2}> */}
        <div className="py-20">
          <div className="h-64 w-64 rounded-full bg-primary flex items-center justify-center">
            {/* <Image
              src={channel?.imageUrl ?? "/images/radio.png"}
              alt="Radio image"
              height={200}
              width={200}
              className="h-52 w-52 object-contain"
              loading="eager"
            /> */}
            <h1 className="text-background text-7xl font-bold">SOS</h1>
          </div>
        </div>
        {/* </RadialBarsKnob> */}
      </div>

      <div className="flex flex-col items-center gap-8">
        <h1 className="justify-center flex text-5xl font-bold text-white">
          {statusMessage}
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
      </div>
    </section>
  );
}
