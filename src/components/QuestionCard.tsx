"use client";

import { AnimatePresence, motion } from "framer-motion";
import { COUPLE, type Choice } from "@/data/couple";
import type { Question } from "@/data/questions";
import { ChoiceButton } from "@/components/ChoiceButton";
import { Timer } from "@/components/Timer";

type DisplaySize = "sm" | "lg" | "host";

type QuestionCardProps = {
  question: Question;
  onSelect: (choice: Choice) => void;
  isSubmitting: boolean;
  selectedChoice?: Choice | null;
  isExpired?: boolean;
  remainingSeconds?: number;
  timerProgress?: number;
  showTimer?: boolean;
  showChoices?: boolean;
  size?: DisplaySize;
};

function HostCoupleStrip() {
  return (
    <div className="flex shrink-0 items-stretch gap-2 rounded-2xl border-2 border-(--gold)/35 bg-white/85 p-2">
      <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-pink-50/90 px-2 py-1 text-center">
        <span className="text-[0.55rem] font-extrabold uppercase tracking-[0.12em] text-pink-500">
          💃 Elle
        </span>
        <span className="font-display text-[clamp(0.9rem,2vmin,1.15rem)] font-bold text-pink-900">
          {COUPLE.elle}
        </span>
      </div>
      <div className="flex items-center px-1">
        <span className="font-display text-[clamp(0.85rem,1.8vmin,1rem)] font-bold italic text-(--gold)">
          VS
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-sky-50/90 px-2 py-1 text-center">
        <span className="text-[0.55rem] font-extrabold uppercase tracking-[0.12em] text-sky-500">
          🕺 Lui
        </span>
        <span className="font-display text-[clamp(0.9rem,2vmin,1.15rem)] font-bold text-sky-900">
          {COUPLE.lui}
        </span>
      </div>
    </div>
  );
}

function CouplePreview({ size }: { size: DisplaySize }) {
  const isLarge = size === "lg";

  return (
    <div
      className={["flex items-stretch justify-center", isLarge ? "gap-8" : "gap-3"].join(" ")}
    >
      <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-pink-300/70 bg-pink-50/80 px-4 py-4 text-center">
        <span className="text-lg">💃</span>
        <span className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-pink-500">
          Elle
        </span>
        <span
          className={[
            "mt-1 font-display font-bold text-pink-900",
            isLarge ? "text-3xl" : "text-xl",
          ].join(" ")}
        >
          {COUPLE.elle}
        </span>
      </div>
      <div className="flex items-center">
        <span
          className={[
            "font-display font-bold italic text-(--gold)",
            isLarge ? "text-4xl" : "text-2xl",
          ].join(" ")}
        >
          VS
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-sky-300/70 bg-sky-50/80 px-4 py-4 text-center">
        <span className="text-lg">🕺</span>
        <span className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-sky-500">
          Lui
        </span>
        <span
          className={[
            "mt-1 font-display font-bold text-sky-900",
            isLarge ? "text-3xl" : "text-xl",
          ].join(" ")}
        >
          {COUPLE.lui}
        </span>
      </div>
    </div>
  );
}

export function QuestionCard({
  question,
  onSelect,
  isSubmitting,
  selectedChoice = null,
  isExpired = false,
  remainingSeconds = 20,
  timerProgress = 0,
  showTimer = false,
  showChoices = true,
  size = "sm",
}: QuestionCardProps) {
  const isHost = size === "host";
  const isLarge = size === "lg";

  if (isHost) {
    return (
      <div className="flex h-full min-h-0 w-full flex-col gap-[clamp(0.35rem,1vh,0.65rem)]">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(1rem,3vh,2.5rem)] px-[clamp(0.5rem,2vw,2rem)]">
          <h2 className="host-question-text wedding-title text-center text-balance">
            {question.text}
          </h2>
          {showTimer ? (
            <Timer
              remainingSeconds={remainingSeconds}
              progress={timerProgress}
              size="host"
            />
          ) : null}
        </div>

        <div className="shrink-0">
          <HostCoupleStrip />
        </div>
      </div>
    );
  }

  const questionBlock = (
    <div
      className={[
        "wedding-card text-center",
        isLarge ? "p-10" : "p-6",
      ].join(" ")}
    >
      <p className="wedding-label">Question du moment</p>
      <h2
        className={[
          "wedding-title mt-3 leading-snug",
          isLarge ? "text-3xl md:text-5xl" : "text-2xl",
        ].join(" ")}
      >
        {question.text}
      </h2>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 24, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        exit={{ opacity: 0, y: -24, rotate: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={["flex w-full flex-col", isLarge ? "gap-10" : "gap-6"].join(" ")}
      >
        {showTimer ? (
          <div className="flex justify-center">
            <Timer
              remainingSeconds={remainingSeconds}
              progress={timerProgress}
              size={size}
            />
          </div>
        ) : null}
        {questionBlock}
        {showChoices ? (
          <div className="grid gap-4">
            <ChoiceButton
              choice="elle"
              name={COUPLE.elle}
              onSelect={onSelect}
              disabled={isSubmitting || isExpired}
              selected={selectedChoice === "elle"}
              size={isLarge ? "lg" : "sm"}
            />
            <ChoiceButton
              choice="lui"
              name={COUPLE.lui}
              onSelect={onSelect}
              disabled={isSubmitting || isExpired}
              selected={selectedChoice === "lui"}
              size={isLarge ? "lg" : "sm"}
            />
          </div>
        ) : (
          <CouplePreview size={size} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
