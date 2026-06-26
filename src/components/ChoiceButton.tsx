import type { Choice } from "@/data/couple";

type ChoiceButtonProps = {
  choice: Choice;
  name: string;
  onSelect: (choice: Choice) => void;
  disabled?: boolean;
  selected?: boolean;
  size?: "sm" | "lg";
};

export function ChoiceButton({
  choice,
  name,
  onSelect,
  disabled = false,
  selected = false,
  size = "sm",
}: ChoiceButtonProps) {
  const isElle = choice === "elle";
  const isLarge = size === "lg";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(choice)}
      aria-pressed={selected}
      className={[
        "group relative flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-3xl border-2 px-4 py-4 text-left text-white transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55",
        isLarge ? "min-h-32 px-5 py-5" : "min-h-20",
        isElle
          ? "border-pink-300/80 bg-linear-to-br from-pink-400 via-pink-500 to-rose-600 shadow-lg shadow-pink-500/30"
          : "border-sky-300/80 bg-linear-to-br from-sky-400 via-sky-500 to-cyan-600 shadow-lg shadow-sky-500/30",
        selected
          ? "ring-4 ring-white/90 ring-offset-2 ring-offset-background brightness-105"
          : "hover:brightness-110",
      ].join(" ")}
    >
      <span
        className={[
          "flex shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm",
          isLarge ? "h-16 w-16 text-3xl" : "h-12 w-12 text-2xl",
        ].join(" ")}
      >
        {isElle ? "💃" : "🕺"}
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-white/80">
          {isElle ? "Elle" : "Lui"}
        </span>
        <span
          className={[
            "font-display font-bold leading-tight text-white",
            isLarge ? "text-3xl" : "text-xl",
          ].join(" ")}
        >
          {name}
        </span>
      </span>

      <span
        className={[
          "flex shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
          isLarge ? "h-8 w-8" : "h-7 w-7",
          selected
            ? isElle
              ? "border-white/90 bg-white text-pink-600"
              : "border-white/90 bg-white text-sky-600"
            : "border-white/40 bg-white/10 text-transparent",
        ].join(" ")}
        aria-hidden
      >
        <svg
          viewBox="0 0 16 16"
          className={isLarge ? "h-4 w-4" : "h-3.5 w-3.5"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            d="M3 8.5l3.5 3.5 6.5-7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}
