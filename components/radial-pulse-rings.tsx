"use client";
import { useEffect, useRef } from "react";

interface RadialPulseRingsProps {
  children?: React.ReactNode;
  numRings?: number;
  size?: number;
  speed?: number;
}

export default function RadialPulseRings({
  children,
  numRings = 3,
  size = 340,
  speed = 1,
}: RadialPulseRingsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const cx = size / 2;
    const cy = size / 2;

    const innerR = size * 0.29;
    const maxR = size * 0.495;
    const ringSpan = maxR - innerR;

    let lastTime = 0;
    let elapsed = 0;
    let raf: number;

    const cycleDuration = 3000 / speed;

    function draw(timestamp: number) {
      const delta = lastTime ? timestamp - lastTime : 0;
      lastTime = timestamp;
      elapsed += delta;

      ctx.clearRect(0, 0, size, size);

      for (let i = 0; i < numRings; i++) {
        const offset = i / numRings;
        const progress = (((elapsed / cycleDuration + offset) % 1) + 1) % 1;

        const radius = innerR + progress * ringSpan;
        const alpha = (1 - progress) * 0.72;
        const lineWidth = (1 - progress) * 2.8 + 0.5;

        const wave = Math.sin((elapsed / 1000) * 0.8 + i * 1.2) * 0.5 + 0.5;
        const r = Math.round(59 + wave * 72);
        const g = Math.round(102 + wave * 61);
        const b = Math.round(143 + wave * 53);

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [numRings, size, speed]);

  const knobDiameter = size * 0.58;

  return (
    <div
      className="relative inline-block"
      style={{ width: size, height: size }}
    >
      <canvas ref={canvasRef} width={size} height={size} className="block" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="flex items-center justify-center rounded-full pointer-events-auto"
          style={{ width: knobDiameter, height: knobDiameter }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
