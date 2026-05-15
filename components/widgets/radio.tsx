"use client";
import providers from "@/lib/radio";
import Provider from "@/lib/radio/provider";
import { RadioChannel } from "@/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Radio() {
  const [channels, setChannels] = useState<Record<string, RadioChannel>>({});
  const [radio, setRadio] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (Object.values(channels).length > 0) return;

    const fetchAll = async () => {
      try {
        await Promise.all(
          Object.values(providers).map(async (provider: Provider) => {
            const data = await provider.fetchChannels();
            setChannels((prev) => ({ ...prev, ...data }));
            if (radio === null && Object.keys(data).length > 0) {
              setRadio(Object.keys(data)[0] ?? null);
            }
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
  }, [radio, channels]);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-gray-300 rounded-xl p-5 flex flex-col items-center gap-3">
        {radio && (
          <div className="flex flex-col items-center gap-3">
            {channels[radio].imageUrl && (
              <Image
                src={channels[radio].imageUrl}
                width={128}
                height={128}
                alt=""
              />
            )}
            <p className="font-bold text-lg">{channels[radio].name}</p>
            <audio
              ref={audioRef}
              controls
              autoPlay
              src={channels[radio].streamUrl}
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
          </div>
        )}
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        {Object.values(channels).map((channel: RadioChannel) => (
          <button
            className={`${radio !== channel.id ? "bg-red-500" : "bg-green-500"} px-3 py-2 rounded text-white`}
            key={channel.id}
            onClick={() => setRadio(channel.id)}
          >
            {channel.name}
          </button>
        ))}
      </div>
    </div>
  );
}
