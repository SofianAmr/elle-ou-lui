"use client";

import { COUPLE } from "@/data/couple";

type GameFinishedScreenProps = {
  size?: "host" | "guest";
  onReset?: () => void;
  isActing?: boolean;
};

export function GameFinishedScreen({
  size = "guest",
  onReset,
  isActing = false,
}: GameFinishedScreenProps) {
  const isHost = size === "host";

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(0.5rem,2vh,1rem)] text-center">
      <div className="animate-float text-[clamp(2.5rem,6vmin,4rem)]">🎉</div>
      <p className="wedding-label">Partie terminée</p>
      <h1
        className={
          isHost
            ? "wedding-title text-[clamp(2rem,5vmin,3.5rem)]"
            : "wedding-title mt-2 text-4xl"
        }
      >
        Merci d&apos;avoir joué !
      </h1>
      <p className="text-[clamp(1.125rem,2.5vmin,1.75rem)] font-bold text-(--rose-gold)">
        {COUPLE.elle} & {COUPLE.lui}
      </p>
      <p className="max-w-md text-[clamp(1rem,2vmin,1.25rem)] text-(--ink-muted)">
        Bravo à tous les invités — place aux danses ! 💃🕺
      </p>
      {onReset ? (
        <button
          type="button"
          disabled={isActing}
          onClick={onReset}
          className="btn-primary-compact mt-2"
        >
          Recommencer
        </button>
      ) : null}
    </div>
  );
}
