"use client";
import channels from "@/lib/radio/index2";
import { useEffect, useRef, useState } from "react";
import Widget from "../widget";
import Status from "../status";
import { Button } from "../ui/button";

export default function Radio2Widget({ message }: { message: number | null }) {
  const [radioIndex, setRadioIndex] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  const channel = channels[radioIndex];

  useEffect(() => {
    async function handleMessage() {
      if (!message) return;
      setRadioIndex((i) => (i === channels.length - 1 ? 0 : i + 1));
      setIsBuffering(true);
    }
    handleMessage();
  }, [message]);

  return (
    <Widget
      title={channel ? `Radio2 - ${channel.name}` : "Radio"}
      image={
        channel && channel.imageUrl !== null
          ? channel.imageUrl
          : "/images/radio.png"
      }
      loading={false}
      imageLoading={false}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-3">
          {isBuffering && (
            <Status
              description="Starting radio..."
              Icon={"loading"}
              variant="neutral"
            />
          )}
          {channel && (
            <div className="flex flex-col items-center gap-3">
              <audio
                ref={audioRef}
                controls
                className="hidden"
                autoPlay
                src={channel.streamUrl}
                onWaiting={() => setIsBuffering(true)}
                onCanPlay={() => setIsBuffering(false)}
                onPlay={() => {
                  if (audioRef.current) {
                    const audio = audioRef.current;
                    if (audio.buffered.length > 0) {
                      audio.currentTime = audio.buffered.end(
                        audio.buffered.length - 1,
                      );
                    }
                    setIsBuffering(false);
                  }
                }}
              />
              <div className="flex gap-2">
                <Button
                  size="lg"
                  onClick={() => {
                    setRadioIndex((i) =>
                      i === 0 ? channels.length - 1 : i - 1,
                    );
                    setIsBuffering(true);
                  }}
                >
                  ← Prev
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    setRadioIndex((i) =>
                      i === channels.length - 1 ? 0 : i + 1,
                    );
                    setIsBuffering(true);
                  }}
                >
                  Next →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Widget>
  );
}
