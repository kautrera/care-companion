import type { SVGProps } from "react";

export function BathroomDrawing(props: SVGProps<SVGSVGElement>) {
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
      <rect x="56" y="14" width="26" height="34" rx="4" />
      <line x1="62" y1="22" x2="76" y2="22" />
      <path d="M22 50 h60 v8 a16 16 0 0 1 -16 16 H38 a16 16 0 0 1 -16 -16 z" />
      <ellipse cx="52" cy="50" rx="30" ry="6" fill="#38bdf8" stroke="currentColor" />
      <line x1="36" y1="74" x2="32" y2="86" />
      <line x1="68" y1="74" x2="72" y2="86" />
    </svg>
  );
}
