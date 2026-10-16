import { cn } from "@/lib/cn";

/** Bloque base de esqueleto. Forma real del contenido, no spinner. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-ticket bg-rosa-claro/40", className)}
    />
  );
}

export function ProductTicketSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-4/5 w-full" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
    </div>
  );
}

/** Esqueleto de fila de tabla (panel admin). */
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-borde py-3">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === 0 ? "w-40" : "flex-1")}
        />
      ))}
    </div>
  );
}
