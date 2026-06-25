type DisplaySize = "sm" | "lg" | "host";

type ProgressBarProps = {
  current: number;
  total: number;
  size?: DisplaySize;
  extraLabel?: string;
};

export function ProgressBar({
  current,
  total,
  size = "sm",
  extraLabel,
}: ProgressBarProps) {
  const progress = Math.round((current / total) * 100);
  const isHost = size === "host";
  const isLarge = size === "lg";

  return (
    <div className="w-full shrink-0">
      <div
        className={[
          "flex items-center justify-between font-semibold text-(--ink-muted)",
          isHost ? "mb-1 text-xs" : isLarge ? "mb-2 text-base" : "mb-2 text-sm",
        ].join(" ")}
      >
        <span>
          Question {current} / {total}
          {extraLabel ? ` · ${extraLabel}` : ""}
        </span>
        <span>{progress}%</span>
      </div>
      <div
        className={[
          "overflow-hidden rounded-full bg-(--gold-light)/60",
          isHost ? "h-1.5" : isLarge ? "h-3" : "h-2",
        ].join(" ")}
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-(--rose-gold) to-(--gold) transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
