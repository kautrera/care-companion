import type { SVGProps } from "react";

export function DiaperDrawing(props: SVGProps<SVGSVGElement>) {
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
      <path
        d="M16 28 H84 L72 60 a8 8 0 0 1 -7 5 H35 a8 8 0 0 1 -7 -5 z"
        fill="#fef3c7"
      />
      <path d="M16 28 H84 L72 60 a8 8 0 0 1 -7 5 H35 a8 8 0 0 1 -7 -5 z" />
      <line x1="22" y1="36" x2="78" y2="36" />
      <circle cx="40" cy="48" r="3" fill="#38bdf8" stroke="none" />
      <circle cx="50" cy="50" r="3" fill="#38bdf8" stroke="none" />
      <circle cx="60" cy="48" r="3" fill="#38bdf8" stroke="none" />
      <path d="M28 70 q22 -10 44 0" />
    </svg>
  );
}
