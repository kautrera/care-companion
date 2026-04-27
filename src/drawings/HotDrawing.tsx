import type { SVGProps } from "react";

export function HotDrawing(props: SVGProps<SVGSVGElement>) {
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
      <circle cx="50" cy="50" r="18" fill="#f59e0b" stroke="#f59e0b" />
      <g stroke="#f59e0b">
        <line x1="50" y1="10" x2="50" y2="22" />
        <line x1="50" y1="78" x2="50" y2="90" />
        <line x1="10" y1="50" x2="22" y2="50" />
        <line x1="78" y1="50" x2="90" y2="50" />
        <line x1="22" y1="22" x2="30" y2="30" />
        <line x1="70" y1="70" x2="78" y2="78" />
        <line x1="78" y1="22" x2="70" y2="30" />
        <line x1="22" y1="78" x2="30" y2="70" />
      </g>
    </svg>
  );
}
