"use client";
import { LucideProps } from "lucide-react";
import { ComponentType } from "react";
import { Spinner } from "./ui/spinner";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface Props {
  Icon?: ComponentType<LucideProps> | "loading" | null;
  title?: string | null;
  description?: string | null;
  variant: "success" | "warning" | "danger" | "neutral" | "info";
  location?: "top" | "bottom";
}

export default function Status({
  variant,
  Icon = null,
  title = null,
  description = null,
  location = "top",
}: Props) {
  const color =
    (
      {
        success: "text-green-200",
        warning: "text-yellow-200",
        danger: "text-red-200",
        info: "text-blue-200",
      } as Record<string, string>
    )[variant] ?? "";

  const iconComponent =
    Icon === "loading" ? (
      <Spinner className="size-4" />
    ) : Icon !== null ? (
      <Icon size={16} strokeWidth={1.5} />
    ) : null;

  return (
    <Button
      variant="glass-disabled"
      disabled={true}
      className={color}
      // className={`absolute ${location === "bottom" ? " bottom-10 right-10" : "top-10 right-10"}`}
    >
      {/* <CardContent
        className={`flex items-center justify-center gap-2 ${color}`}
      > */}
      {iconComponent}
      <p>
        {title && (
          <span className={`font-bold ${description ? "mr-1" : ""}`}>
            {title}
          </span>
        )}
        {description}
      </p>
      {/* </CardContent> */}
    </Button>
  );
}
