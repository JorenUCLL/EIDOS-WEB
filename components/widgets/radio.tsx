"use client";

import Image from "next/image";
import Status from "../status";
import { Button } from "../ui/button";
import { useRadio } from "@/hooks/useRadio";
import channels from "@/lib/radio";
import { Card, CardContent } from "../ui/card";
import { ArrowLeft, ArrowRight, ChevronFirst, ChevronLast } from "lucide-react";

export default function Radio2Widget({ message }: { message: number | null }) {
  const {
    channel,
    audioRef,
    isBuffering,
    prev,
    next,
    onWaiting,
    onCanPlay,
    onPlay,
  } = useRadio(message);

  return (
    <section className="flex flex-col gap-20 py-20">
      <div className="flex flex-col items-center gap-10 ">
        <div className="h-64 w-64 rounded-full bg-primary flex items-center justify-center">
          <Image
            src={channel?.imageUrl ?? "/images/radio.png"}
            alt="Radio image"
            height={200}
            width={200}
            className="h-52 w-52 object-contain"
            loading="eager"
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <h1 className="justify-center flex text-5xl font-bold text-white">
          {channel ? channel.name : "Radio"}
        </h1>
        <div className="flex flex-col items-center gap-3">
          {channel && (
            <div className="flex flex-col items-center gap-3">
              <audio
                ref={audioRef}
                controls
                className="hidden"
                autoPlay
                src={channel.streamUrl}
                onWaiting={onWaiting}
                onCanPlay={onCanPlay}
                onPlay={onPlay}
              />
              <div className="flex gap-7">
                <Button
                  size="icon-very-big"
                  variant="glass-active"
                  onClick={prev}
                >
                  <ChevronFirst className="size-8 text-primary" />
                </Button>
                <Button
                  variant="glass-active"
                  size="icon-very-big"
                  onClick={next}
                >
                  <ChevronLast className="size-8 text-primary" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className=" justify-center items-center flex gap-4">
        {channels.map((channelList) => {
          return (
            <Card
              key={channelList.id}
              variant={
                channel?.id === channelList.id ? "glass-active" : "glass"
              }
              className=" w-42"
            >
              <CardContent className="flex gap-2 items-center">
                <Image
                  src={channelList.imageUrl ?? "/images/radio.png"}
                  alt="Radio image"
                  height={40}
                  width={40}
                  className=" h-10 w-10 object-contain"
                  loading="eager"
                />
                <div className="">
                  <p className="text-white font-bold">{channelList.name}</p>
                  <p className="">{channelList.provider}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {isBuffering && (
        <Status
          description="Starting radio..."
          Icon="loading"
          variant="neutral"
          className="absolute bottom-10 right-10"
        />
      )}
    </section>
  );
}
