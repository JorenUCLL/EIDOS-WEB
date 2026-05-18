"use client";
import { LucideProps } from "lucide-react";
import { ComponentType } from "react";
import { Spinner } from "./ui/spinner";

interface Props {
  Icon?: ComponentType<LucideProps> | "loading" | null;
  title?: string | null;
  description?: string | null;
  variant: "success" | "warning" | "danger" | "neutral" | "info";
}

export default function Status({
  Icon = null,
  title = null,
  description = null,
  variant,
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
    <section
      className={`absolute top-10 right-10 flex items-center gap-2 bg-stone-800 px-3 py-2 rounded-md ${color}`}
    >
      {iconComponent}
      <p>
        {title && (
          <span className={`font-bold ${description ? "mr-1" : ""}`}>
            {title}
          </span>
        )}
        {description}
      </p>
    </section>
  );
}
