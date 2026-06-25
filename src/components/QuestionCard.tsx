"use client";

import { AnimatePresence, motion } from "framer-motion";
import { COUPLE, type Choice } from "@/data/couple";
import type { Question } from "@/data/questions";
import { ChoiceButton } from "@/components/ChoiceButton";
import { ProgressBar } from "@/components/ProgressBar";

type QuestionCardProps = {
  question: Question;
  currentIndex: number;
  total: number;
  onSelect: (choice: Choice) => void;
  isSubmitting: boolean;
};

export function QuestionCard({
  question,
  currentIndex,
  total,
  onSelect,
  isSubmitting,
}: QuestionCardProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.25 }}
        className="flex w-full flex-col gap-8"
      >
        <ProgressBar current={currentIndex} total={total} />
        <h2 className="text-center text-2xl font-semibold leading-snug text-stone-800">
          {question.text}
        </h2>
        <div className="grid gap-4">
          <ChoiceButton
            choice="elle"
            name={COUPLE.elle}
            onSelect={onSelect}
            disabled={isSubmitting}
          />
          <ChoiceButton
            choice="lui"
            name={COUPLE.lui}
            onSelect={onSelect}
            disabled={isSubmitting}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
