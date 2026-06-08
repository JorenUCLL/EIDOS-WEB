"use client";
import { LngLatLike } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

type TextStatus = "idle" | "armed" | "sending" | "sent" | "error";

export function useText(message: number | null, coords: LngLatLike | null) {
  const [status, setStatus] = useState<TextStatus>("idle");
  const [countdown, setCountdown] = useState(0);
  const sendMessageTimestampRef = useRef(0);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const statusMessage: Record<TextStatus, string> = {
    idle: "Send SOS",
    armed: `Confirm to send SOS (${countdown}s)`,
    sending: "Sending SOS...",
    sent: "SOS sent!",
    error: "Failed to send SOS",
  };

  const clearCountdown = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const startCountdown = (seconds: number) => {
    clearCountdown();
    setCountdown(seconds);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearCountdown();
          setStatus("idle");
          sendMessageTimestampRef.current = 0;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resolveAddress = async (coords: [number, number]): Promise<string> => {
    try {
      const [lng, lat] = coords;
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
      );
      const data = await res.json();
      return data.features?.[0]?.place_name ?? "Unknown address";
    } catch {
      return "Unknown address";
    }
  };

  const sendMessage = async () => {
    // const coordsValue = coords ? `coords` : "Unknown";
    // const address = coords ? await resolveAddress(coords) : "Unknown";
    // const mapsLink = coords
    //   ? `https://www.google.com/maps?q=${coords[1]},${coords[0]}`
    //   : null;

    try {
      await fetch(process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "Emergency",
          avatar_url: "https://iconape.com/wp-content/files/jw/338761/png/338761.png",
          content: "**Emergency:** There has been a report!",
          embeds: [
            {
              fields: [
                {
                  name: "Reporter",
                  value: process.env.NEXT_PUBLIC_REPORTER ?? "Jonas Roets",
                  inline: false,
                },
                {
                  name: "Coordinates",
                  value: "TODO",
                  inline: false,
                }
                // {
                //   name: "Address",
                //   value: address,
                //   inline: false,
                // },
                // ...(mapsLink
                //   ? [{ name: "Maps", value: `[Open in Google Maps](${mapsLink})`, inline: false }]
                //   : []),
              ],
            },
          ],
        }),
      });
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("[useText] Failed to send:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const send = async () => {
    const timestamp = Date.now();
    const elapsed = timestamp - sendMessageTimestampRef.current;

    if (elapsed > 10_000) {
      sendMessageTimestampRef.current = timestamp;
      setStatus("armed");
      startCountdown(10);
      return;
    }

    clearCountdown();
    sendMessageTimestampRef.current = 0;
    setStatus("sending");
    await sendMessage();
  };

  useEffect(() => {
    if (!message) return;
    send();
  }, [message]);

  useEffect(() => {
    return () => clearCountdown();
  }, []);

  return { send, status, statusMessage: statusMessage[status] };
}