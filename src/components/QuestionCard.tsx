"use client";

import { AnimatePresence, motion } from "framer-motion";
import { COUPLE, type Choice } from "@/data/couple";
import type { Question } from "@/data/questions";
import { ChoiceAvatar } from "@/components/ChoiceAvatar";
import { ChoiceButton } from "@/components/ChoiceButton";
import { Timer } from "@/components/Timer";
import {
  choiceCardFluidClass,
  choiceCardHostClass,
} from "@/lib/choice-card-styles";

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

function HostCoupleStrip({
  questionId,
  showImage,
}: {
  questionId: number;
  showImage: boolean;
}) {
  if (!showImage) {
    return null;
  }

  return (
    <div className="flex shrink-0 items-center justify-center gap-[clamp(0.5rem,1.5vw,1rem)] px-[clamp(0.25rem,1vw,0.75rem)]">
      <div className="flex flex-1 justify-center">
        <div
          className={[
            choiceCardHostClass,
            "shadow-[0_8px_28px_-6px_rgba(236,72,153,0.3)]",
          ].join(" ")}
        >
          <ChoiceAvatar choice="elle" questionId={questionId} variant="cover" />
        </div>
      </div>
      <div className="flex shrink-0 items-center px-0.5">
        <span className="font-display text-[clamp(0.85rem,1.8vmin,1rem)] font-bold italic text-(--gold)">
          VS
        </span>
      </div>
      <div className="flex flex-1 justify-center">
        <div
          className={[
            choiceCardHostClass,
            "shadow-[0_8px_28px_-6px_rgba(14,165,233,0.3)]",
          ].join(" ")}
        >
          <ChoiceAvatar choice="lui" questionId={questionId} variant="cover" />
        </div>
      </div>
    </div>
  );
}

function CouplePreview({
  questionId,
  size,
  showImage,
}: {
  questionId: number;
  size: DisplaySize;
  showImage: boolean;
}) {
  const isLarge = size === "lg";

  if (!showImage) {
    return null;
  }

  return (
    <div
      className={["flex items-stretch justify-center", isLarge ? "gap-6" : "gap-3"].join(" ")}
    >
      <div
        className={[
          choiceCardFluidClass,
          "flex-1 shadow-[0_8px_28px_-6px_rgba(236,72,153,0.28)]",
        ].join(" ")}
      >
        <ChoiceAvatar choice="elle" questionId={questionId} variant="cover" />
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
      <div
        className={[
          choiceCardFluidClass,
          "flex-1 shadow-[0_8px_28px_-6px_rgba(14,165,233,0.28)]",
        ].join(" ")}
      >
        <ChoiceAvatar choice="lui" questionId={questionId} variant="cover" />
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
  const showImages = !showTimer || Boolean(isExpired);

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
          <HostCoupleStrip questionId={question.id} showImage={showImages} />
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
          <div className="grid grid-cols-2 gap-3">
            <ChoiceButton
              choice="elle"
              name={COUPLE.elle}
              questionId={question.id}
              onSelect={onSelect}
              disabled={isSubmitting || isExpired}
              selected={selectedChoice === "elle"}
              showImage={showImages}
              size={isLarge ? "lg" : "sm"}
            />
            <ChoiceButton
              choice="lui"
              name={COUPLE.lui}
              questionId={question.id}
              onSelect={onSelect}
              disabled={isSubmitting || isExpired}
              selected={selectedChoice === "lui"}
              showImage={showImages}
              size={isLarge ? "lg" : "sm"}
            />
          </div>
        ) : (
          <CouplePreview
            questionId={question.id}
            size={size}
            showImage={showImages}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
