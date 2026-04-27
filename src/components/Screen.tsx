import type { ReactNode } from "react";

interface ScreenProps {
  children: ReactNode;
  title?: string;
  /** Visual style for screen background. */
  variant?: "default" | "patient";
}

export function Screen({ children, title, variant = "default" }: ScreenProps) {
  return (
    <div
      className={[
        "flex h-[100dvh] w-full flex-col",
        variant === "patient" ? "bg-bg" : "bg-bg",
      ].join(" ")}
    >
      {title && (
        <header className="px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-2 text-ink">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        </header>
      )}
      <main className="flex min-h-0 flex-1 flex-col px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {children}
      </main>
    </div>
  );
}
