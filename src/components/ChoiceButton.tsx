import { ChoiceAvatar } from "@/components/ChoiceAvatar";
import type { Choice } from "@/data/couple";

type ChoiceButtonProps = {
  choice: Choice;
  name: string;
  questionId: number;
  onSelect: (choice: Choice) => void;
  disabled?: boolean;
  selected?: boolean;
  showImage?: boolean;
  size?: "sm" | "lg";
};

export function ChoiceButton({
  choice,
  name,
  questionId,
  onSelect,
  disabled = false,
  selected = false,
  showImage = true,
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
      aria-label={`Voter pour ${name}`}
      className={[
        "relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-3xl transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--gold)",
        "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55",
        isElle
          ? "shadow-[0_8px_24px_-4px_rgba(236,72,153,0.35)]"
          : "shadow-[0_8px_24px_-4px_rgba(14,165,233,0.35)]",
        selected ? "ring-[3px] ring-(--gold) ring-offset-2 ring-offset-background" : "",
      ].join(" ")}
    >
      <ChoiceAvatar
        key={`${questionId}-${choice}-${showImage}`}
        choice={choice}
        questionId={questionId}
        variant="cover"
        showImage={showImage}
      />

      {selected ? (
        <span className="pointer-events-none absolute inset-0 bg-black/20" aria-hidden />
      ) : null}

      {selected ? (
        <span
          className={[
            "absolute top-2.5 right-2.5 flex items-center justify-center rounded-full border-2 border-white bg-white shadow-lg",
            isLarge ? "h-9 w-9" : "h-8 w-8",
            isElle ? "text-pink-600" : "text-sky-600",
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
      ) : null}
    </button>
  );
}
