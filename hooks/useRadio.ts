// hooks/useRadio.ts
"use client";

import channels from "@/lib/radio";
import { useEffect, useRef, useState } from "react";

export function useRadio(message: number | null) {
  const [radioIndex, setRadioIndex] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const channel = channels[radioIndex];

  const prev = () => {
    setRadioIndex((i) => (i === 0 ? channels.length - 1 : i - 1));
    setIsBuffering(true);
  };

  const next = () => {
    setRadioIndex((i) => (i === channels.length - 1 ? 0 : i + 1));
    setIsBuffering(true);
  };

  const onWaiting = () => setIsBuffering(true);

  const onCanPlay = () => setIsBuffering(false);

  const onPlay = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    if (audio.buffered.length > 0) {
      audio.currentTime = audio.buffered.end(audio.buffered.length - 1);
    }
    setIsBuffering(false);
  };

  useEffect(() => {
    const func = async () => {
      if (!message) return;
      next();
    };
    func();
  }, [message]);

  return {
    channel,
    audioRef,
    isBuffering,
    prev,
    next,
    onWaiting,
    onCanPlay,
    onPlay,
  };
}
