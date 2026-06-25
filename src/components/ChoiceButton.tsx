import type { Choice } from "@/data/couple";

type ChoiceButtonProps = {
  choice: Choice;
  name: string;
  onSelect: (choice: Choice) => void;
  disabled?: boolean;
};

export function ChoiceButton({
  choice,
  name,
  onSelect,
  disabled = false,
}: ChoiceButtonProps) {
  const isElle = choice === "elle";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(choice)}
      className={[
        "flex min-h-28 w-full flex-col items-center justify-center rounded-3xl border-2 px-6 py-5 text-center shadow-lg transition active:scale-[0.98] disabled:opacity-60",
        isElle
          ? "border-rose-300 bg-rose-50 text-rose-900"
          : "border-sky-300 bg-sky-50 text-sky-900",
      ].join(" ")}
    >
      <span className="text-sm font-medium uppercase tracking-[0.2em] opacity-70">
        {isElle ? "Elle" : "Lui"}
      </span>
      <span className="mt-2 text-2xl font-semibold">{name}</span>
    </button>
  );
}
