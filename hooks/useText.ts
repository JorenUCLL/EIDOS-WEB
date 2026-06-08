"use client";
import { useEffect, useRef, useState } from "react";

type TextStatus = "idle" | "armed" | "sending" | "sent" | "error";

export function useText(message: number | null) {
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

  const sendMessage = async () => {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${process.env.NEXT_PUBLIC_PHONE_NUMBER}&text=SOS%20Message&apikey=${process.env.NEXT_PUBLIC_PHONE_API}`;
    console.debug("[useText] Sending SOS to URL:", url);

    setStatus("sending");
    try {
      const res = await fetch(url, { mode: "no-cors" });
      // no-cors responses are always "opaque" — status/body unreadable, but request went through
      console.debug("[useText] Fetch completed (opaque response, no-cors mode)", res);
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("[useText] Fetch failed:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const send = async () => {
    const timestamp = Date.now();
    const elapsed = timestamp - sendMessageTimestampRef.current;

    console.debug("[useText] send() called — elapsed since arm:", elapsed, "ms, status:", status);

    if (elapsed > 10_000) {
      console.debug("[useText] Arming SOS — waiting for confirmation within 10s");
      sendMessageTimestampRef.current = timestamp;
      setStatus("armed");
      startCountdown(10);
      return;
    }

    clearCountdown();
    sendMessageTimestampRef.current = 0;
    await sendMessage();
  };

  useEffect(() => {
    if (!message) return;
    send();
  }, [message]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => clearCountdown();
  }, []);

  return {
    send,
    status,
    statusMessage: statusMessage[status],
  };
}