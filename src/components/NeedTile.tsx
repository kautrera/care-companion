import type { NeedSlug } from "../lib/types";
import { Drawing, hasDrawing } from "../drawings";

interface NeedTileProps {
  slug: NeedSlug;
  label: string;
  onSelect: (slug: NeedSlug) => void;
  size?: "lg" | "md";
}

export function NeedTile({ slug, label, onSelect, size = "lg" }: NeedTileProps) {
  const withImage = hasDrawing(slug);

  return (
    <button
      type="button"
      onClick={() => onSelect(slug)}
      className={[
        "group relative flex flex-col items-center justify-center gap-2 rounded-3xl bg-surface text-ink shadow-lg shadow-black/20 ring-1 ring-line/30 transition-transform active:scale-[0.97] active:bg-surface-hi",
        size === "lg" ? "min-h-40 p-4" : "min-h-32 p-3",
      ].join(" ")}
      aria-label={label}
    >
      {withImage ? (
        <>
          <Drawing
            slug={slug}
            className={size === "lg" ? "h-24 w-24" : "h-16 w-16"}
          />
          <span
            className={[
              "font-semibold tracking-tight",
              size === "lg" ? "text-2xl" : "text-lg",
            ].join(" ")}
          >
            {label}
          </span>
        </>
      ) : (
        <span
          className={[
            "px-1 text-center font-semibold leading-tight tracking-tight",
            size === "lg" ? "text-2xl" : "text-base",
          ].join(" ")}
        >
          {label}
        </span>
      )}
    </button>
  );
}
