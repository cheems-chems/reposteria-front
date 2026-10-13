import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type AlertTone = "info" | "success" | "error" | "warning";

const tones: Record<AlertTone, { box: string; title: string }> = {
  info: { box: "border-kraft bg-papel", title: "text-cacao" },
  success: { box: "border-pistacho bg-pistacho/15", title: "text-cacao" },
  error: { box: "border-guayaba bg-guayaba/8", title: "text-guayaba-tinta" },
  warning: { box: "border-kraft bg-kraft/15", title: "text-cacao" },
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
        "flex flex-col gap-1 rounded-(--radius-soft) border p-3.5 text-sm",
        t.box,
        className,
      )}
    >
      {title ? (
        <p className={cn("font-sans font-semibold", t.title)}>{title}</p>
      ) : null}
      <div className="text-cacao/90">{children}</div>
    </div>
  );
}
