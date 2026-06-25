type DisplaySize = "sm" | "lg" | "host";

type TimerProps = {
  remainingSeconds: number;
  progress: number;
  size?: DisplaySize;
};

const TIMER_CONFIG: Record<
  DisplaySize,
  { radius: number; stroke: number; textClass: string }
> = {
  sm: { radius: 52, stroke: 6, textClass: "text-2xl" },
  lg: { radius: 88, stroke: 10, textClass: "text-6xl" },
  host: { radius: 100, stroke: 14, textClass: "text-[clamp(3rem,14vmin,7rem)]" },
};

export function Timer({ remainingSeconds, progress, size = "sm" }: TimerProps) {
  const isHost = size === "host";
  const config = TIMER_CONFIG[size];
  const isUrgent = remainingSeconds <= 5;

  const { radius, stroke, textClass } = config;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div
      className={[
        "relative inline-flex shrink-0 items-center justify-center rounded-full",
        isHost ? "drop-shadow-[0_8px_24px_rgba(212,168,83,0.35)]" : "",
        isUrgent ? "animate-pulse" : "",
      ].join(" ")}
    >
      <svg
        width={(radius + stroke) * 2}
        height={(radius + stroke) * 2}
        className="-rotate-90"
      >
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-(--gold-light)"
        />
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={[
            "transition-[stroke-dashoffset] duration-100",
            isUrgent ? "text-rose-500" : "text-(--rose-gold)",
          ].join(" ")}
        />
      </svg>
      <span
        className={[
          "absolute font-extrabold tabular-nums",
          textClass,
          isUrgent ? "text-rose-600" : "text-(--ink)",
        ].join(" ")}
      >
        {remainingSeconds}
      </span>
    </div>
  );
}
