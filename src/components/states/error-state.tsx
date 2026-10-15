import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

/** Error de red con reintento. Nunca dejar al usuario sin salida. */
export function ErrorState({
  title = "No pudimos cargar esto",
  description = "Parece que se cortó la conexión. Revisa tu internet e inténtalo otra vez.",
  onRetry,
  retryLabel = "Reintentar",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center gap-3 border border-fuchsia/40 bg-fuchsia/5 px-6 py-12 text-center",
        className,
      )}
    >
      <h3 className="font-serif text-2xl text-fuchsia-ink">{title}</h3>
      <p className="max-w-md text-sm text-brown-soft">{description}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
