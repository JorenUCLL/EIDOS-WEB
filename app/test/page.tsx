"use client";

import { CSSProperties, useEffect, useState } from "react";

export default function Home() {
  const [screenHz, setScreenHz] = useState<number | null>(null);

  useEffect(() => {
    let raf: number;
    let times: number[] = [];

    function measure(now: number) {
      times.unshift(now);
      if (times.length > 10) {
        const t0 = times.pop()!;
        setScreenHz(Math.round((1000 * 10) / (now - t0)));
      }
      raf = requestAnimationFrame(measure);
    }

    function restart() {
      cancelAnimationFrame(raf);
      times = [];
      setScreenHz(null);
      raf = requestAnimationFrame(measure);
    }

    raf = requestAnimationFrame(measure);

    // Fires when the window moves to a screen with a different refresh rate
    const mq = window.matchMedia("screen and (min-resolution: 1dppx)");
    mq.addEventListener("change", restart);

    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener("change", restart);
    };
  }, []);

  const hzFirst = 8.57;

  return (
    <div className="flex flex-col gap-6 justify-center items-center min-h-screen">
      <p className="text-sm text-zinc-400 font-mono">
        Screen: {screenHz !== null ? `${screenHz} Hz` : "measuring…"}
      </p>

      <div
        className="flicker w-94 h-94 rounded-2xl
          [--flicker-phase:0deg]
          [--flicker-on-color:#2dd4bf]
          [--flicker-off-color:#18181b]"
        style={{ "--flicker-duration": `${1 / hzFirst}s` } as CSSProperties}
      />
    </div>
  );
}
