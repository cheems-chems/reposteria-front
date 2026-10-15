import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AlertTone = "info" | "success" | "error" | "warning";

const tones: Record<AlertTone, { box: string; title: string }> = {
  info: { box: "border-kraft bg-papel", title: "text-brown-text" },
  success: { box: "border-soft-pink bg-soft-pink/20", title: "text-brown-text" },
  error: { box: "border-fuchsia bg-soft-pink/30", title: "text-fuchsia-ink" },
  warning: { box: "border-kraft bg-kraft/20", title: "text-brown-text" },
};

interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Alert({ tone = "info", title, children, className }: AlertProps) {
  const t = tones[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex flex-col gap-1 rounded-soft border p-3.5 text-sm",
        t.box,
        className,
      )}
    >
      {title ? (
        <p className={cn("font-sans font-semibold", t.title)}>{title}</p>
      ) : null}
      <div className="text-brown-text/90">{children}</div>
    </div>
  );
}
