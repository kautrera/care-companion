import type { SVGProps } from "react";

export function ThirstDrawing(props: SVGProps<SVGSVGElement>) {
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
      <path d="M30 18 H70 L66 88 a2 2 0 0 1 -2 2 H36 a2 2 0 0 1 -2 -2 z" />
      <path
        d="M33 50 q4 -6 8 0 t8 0 t8 0 t8 0 L65 88 a2 2 0 0 1 -2 2 H37 a2 2 0 0 1 -2 -2 z"
        fill="#38bdf8"
        stroke="#38bdf8"
      />
      <path
        d="M33 50 q4 -6 8 0 t8 0 t8 0 t8 0"
        stroke="currentColor"
        fill="none"
      />
    </svg>
  );
}
