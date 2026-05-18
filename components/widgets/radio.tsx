"use client";
import providers from "@/lib/radio";
import Provider from "@/lib/radio/provider";
import { RadioChannel } from "@/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Widget from "../widget";

export default function Radio() {
  const [channels, setChannels] = useState<Record<string, RadioChannel>>({});
  const [radioIndex, setRadioIndex] = useState<number>(0);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    if (Object.values(channels).length > 0) return;
    const fetchAll = async () => {
      try {
        await Promise.all(
          Object.values(providers).map(async (provider: Provider) => {
            const data = await provider.fetchChannels();
            setChannels((prev) => ({ ...prev, ...data }));
          }),
        );
      } catch (err) {
        if (err instanceof Error) {
          console.error(err.message);
        }
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [channels]);

  const channelList = Object.values(channels);
  const channel = channelList[radioIndex];

  return (
    <Widget
      title={channel ? `Radio - ${channel.name}` : "Radio"}
      image={
        channel && channel.imageUrl !== null
          ? channel.imageUrl
          : "https://images.squarespace-cdn.com/content/v1/54becebee4b05d09416fe7e4/1740078384482-SNXQ2PY5WDH0I2I35RZU/iHP_primary_Color.png?format=500w"
      }
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-3">
          {error && <div>failed to load</div>}
          {!error && isLoading && <div>failed to load</div>}
          {!error && !isLoading && channel && (
            <div className="flex flex-col items-center gap-3">
              <audio
                ref={audioRef}
                controls
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
                  }
                }}
              />
              {isBuffering && (
                <p className="text-sm text-gray-500">Loading stream...</p>
              )}
              <div className="flex gap-2">
                <button
                  className="bg-red-500 px-3 py-2 rounded text-white"
                  onClick={() =>
                    setRadioIndex((i) =>
                      i === 0 ? channelList.length - 1 : i - 1,
                    )
                  }
                >
                  ← Prev
                </button>
                <button
                  className="bg-red-500 px-3 py-2 rounded text-white"
                  onClick={() =>
                    setRadioIndex((i) =>
                      i === channelList.length - 1 ? 0 : i + 1,
                    )
                  }
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Widget>
  );
}
