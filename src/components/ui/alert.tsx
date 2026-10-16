import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AlertTone = "info" | "success" | "error" | "warning";

const tones: Record<AlertTone, { box: string; title: string }> = {
  info: { box: "border-rosa-medio bg-tarjeta", title: "text-vino" },
  success: { box: "border-rosa-claro bg-rosa-claro/20", title: "text-vino" },
  error: { box: "border-fucsia bg-rosa-claro/30", title: "text-fucsia-hover" },
  warning: { box: "border-rosa-medio bg-rosa-medio/20", title: "text-vino" },
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
      <div className="text-vino/90">{children}</div>
    </div>
  );
}
