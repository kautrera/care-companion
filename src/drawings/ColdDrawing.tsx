import type { SVGProps } from "react";

export function ColdDrawing(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="#38bdf8"
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="50" y1="14" x2="50" y2="86" />
      <line x1="14" y1="50" x2="86" y2="50" />
      <line x1="24" y1="24" x2="76" y2="76" />
      <line x1="76" y1="24" x2="24" y2="76" />

      <polyline points="44,18 50,24 56,18" />
      <polyline points="44,82 50,76 56,82" />
      <polyline points="18,44 24,50 18,56" />
      <polyline points="82,44 76,50 82,56" />

      <polyline points="22,32 30,30 32,22" />
      <polyline points="78,32 70,30 68,22" />
      <polyline points="22,68 30,70 32,78" />
      <polyline points="78,68 70,70 68,78" />
    </svg>
  );
}
