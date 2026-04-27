import type { SVGProps } from "react";

export function HungerDrawing(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M28 32 Q34 22 40 32" />
      <path d="M44 30 Q50 18 56 30" />
      <path d="M60 32 Q66 22 72 32" />
      <path d="M22 50 H78 a4 4 0 0 1 4 4 v2 a26 26 0 0 1 -26 26 H44 A26 26 0 0 1 18 56 v-2 a4 4 0 0 1 4 -4 z" />
      <line x1="14" y1="78" x2="86" y2="78" />
      <circle cx="50" cy="50" r="6" fill="#f59e0b" stroke="none" />
    </svg>
  );
}
