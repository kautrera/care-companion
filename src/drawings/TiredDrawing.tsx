import type { SVGProps } from "react";

export function TiredDrawing(props: SVGProps<SVGSVGElement>) {
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
      <rect x="14" y="62" width="72" height="20" rx="4" />
      <line x1="14" y1="82" x2="14" y2="92" />
      <line x1="86" y1="82" x2="86" y2="92" />
      <path
        d="M22 56 a8 8 0 0 1 8 -8 H56 a8 8 0 0 1 8 8 v6 H22 z"
        fill="#fef3c7"
      />
      <path d="M22 56 a8 8 0 0 1 8 -8 H56 a8 8 0 0 1 8 8 v6 H22 z" />
      <path d="M64 62 V52 a4 4 0 0 1 4 -4 h10 a8 8 0 0 1 8 8 v6" />
      <path d="M70 22 h10 l-10 14 h10" stroke="#a78bfa" />
      <path d="M58 14 h6 l-6 8 h6" stroke="#a78bfa" />
    </svg>
  );
}
