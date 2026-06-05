"use client";
import { useEffect, useRef } from "react";

interface RadialBarsKnobProps {
  children?: React.ReactNode;
  numBars?: number;
  size?: number;
  speed?: number;
}

export default function RadialBarsKnob({
  children,
  numBars = 48,
  size = 340,
  speed = 1,
}: RadialBarsKnobProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const cx = size / 2;
    const cy = size / 2;
    const innerR = size * 0.29;
    const ringR = innerR + size * 0.03;
    const minH = size * 0.018;
    const maxH = size * 0.082;
    const phases = Array.from(
      { length: numBars },
      () => Math.random() * Math.PI * 2,
    );
    let t = 0;
    let raf: number;

    function draw() {
      ctx.clearRect(0, 0, size, size);
      for (let i = 0; i < numBars; i++) {
        const angle = (i / numBars) * Math.PI * 2 - Math.PI / 2;
        const wave = Math.sin(t * 0.05 * speed + phases[i]) * 0.5 + 0.5;
        const wave2 = Math.sin(t * 0.028 * speed + phases[i] * 1.7) * 0.3 + 0.3;
        const combined = (wave + wave2) / 1.3;
        const barH = minH + combined * (maxH - minH);
        const x1 = cx + Math.cos(angle) * (ringR + 4);
        const y1 = cy + Math.sin(angle) * (ringR + 4);
        const x2 = cx + Math.cos(angle) * (ringR + 4 + barH);
        const y2 = cy + Math.sin(angle) * (ringR + 4 + barH);
        const b = 0.4 + combined * 0.6;
        const r = Math.round((59 + combined * 72) * b);
        const g = Math.round((102 + combined * 61) * b);
        const bl = Math.round((143 + combined * 53) * b);
        ctx.strokeStyle = `rgb(${r}, ${g}, ${bl})`;
        ctx.lineWidth = Math.max(1.5, ((Math.PI * 2 * ringR) / numBars) * 0.45);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      t++;
      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, [numBars, size, speed]);

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
