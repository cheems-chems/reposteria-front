"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import type { Section } from "@/lib/api";

const base =
  "flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-soft border px-4 font-sans text-sm transition-colors";

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 3L3 9M3 3L9 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Se refleja en la URL con ?seccion=<slug>; los slugs y nombres vienen de los datos. */
export function SectionNav({
  sections,
  current,
}: {
  sections: Section[];
  current?: string | null;
}) {
  const router = useRouter();

  const handleClick = (slug: string) => {
    if (current === slug) {
      router.push("/tienda");
      return;
    }
    router.push(`/tienda?seccion=${slug}`);
  };

  return (
    <nav
      aria-label="Filtrar por sección"
      className="flex gap-2 overflow-x-auto scrollbar-hide"
    >
      {sections.map((section) => {
        const isActive = current === section.slug;
        return (
          <button
            key={section.slug}
            type="button"
            aria-pressed={isActive}
            onClick={() => handleClick(section.slug)}
            className={cn(
              base,
              isActive
                ? "border-fucsia bg-fucsia text-white"
                : "border-borde text-vino/80 hover:bg-rosa-claro/40",
            )}
          >
            {section.name}
            {isActive ? <XIcon /> : null}
          </button>
        );
      })}
    </nav>
  );
}
