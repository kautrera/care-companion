import type { SVGProps } from "react";

export function PainDrawing(props: SVGProps<SVGSVGElement>) {
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
      <g transform="rotate(-30 50 50)">
        <rect x="20" y="40" width="60" height="20" rx="6" fill="#fde68a" />
        <rect x="20" y="40" width="60" height="20" rx="6" />
        <line x1="38" y1="40" x2="38" y2="60" />
        <line x1="62" y1="40" x2="62" y2="60" />
        <circle cx="46" cy="46" r="2.5" fill="#dc2626" stroke="none" />
        <circle cx="54" cy="46" r="2.5" fill="#dc2626" stroke="none" />
        <circle cx="46" cy="54" r="2.5" fill="#dc2626" stroke="none" />
        <circle cx="54" cy="54" r="2.5" fill="#dc2626" stroke="none" />
      </g>
    </svg>
  );
}
