"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChoiceAvatar } from "@/components/ChoiceAvatar";
import { COUPLE } from "@/data/couple";
import { getPercent } from "@/lib/game";
import type { QuestionResult } from "@/types";

type DisplaySize = "sm" | "lg" | "host";

type ResultsPanelProps = {
  questionId: number;
  questionText: string;
  result: QuestionResult;
  size?: DisplaySize;
};

const hostStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const hostFadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

const hostSlideIn = {
  elle: {
    hidden: { opacity: 0, x: -48, scale: 0.92 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.55, ease: "easeOut" as const },
    },
  },
  lui: {
    hidden: { opacity: 0, x: 48, scale: 0.92 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.55, ease: "easeOut" as const },
    },
  },
};

const guestStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const guestFadeUp = {
  hidden: { opacity: 0, y: 24, rotate: -1 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

function useAnimatedPercent(target: number, delayMs: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const start = performance.now();
      const duration = 900;

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, delayMs);

    return () => window.clearTimeout(timeout);
  }, [target, delayMs]);

  return value;
}

export function ResultsPanel({
  questionId,
  questionText,
  result,
  size = "sm",
}: ResultsPanelProps) {
  if (size === "host") {
    return (
      <HostResultsLayout
        questionId={questionId}
        questionText={questionText}
        result={result}
      />
    );
  }

  return (
    <GuestResultsLayout
      questionId={questionId}
      questionText={questionText}
      result={result}
      size={size}
    />
  );
}

function HostResultsLayout({
  questionId,
  questionText,
  result,
}: {
  questionId: number;
  questionText: string;
  result: QuestionResult;
}) {
  const ellePercent = getPercent(result.elle, result.total);
  const luiPercent = getPercent(result.lui, result.total);
  const winner =
    ellePercent > luiPercent
      ? "elle"
      : luiPercent > ellePercent
        ? "lui"
        : null;

  return (
    <motion.div
      className="flex h-full min-h-0 flex-col gap-[clamp(0.75rem,2vh,1.25rem)] px-[clamp(0.5rem,2vw,1.5rem)] py-[clamp(0.25rem,1vh,0.75rem)]"
      initial="hidden"
      animate="visible"
      variants={hostStagger}
    >
      <motion.div className="shrink-0 text-center" variants={hostFadeUp}>
        <motion.span
          className="inline-flex items-center gap-1.5 rounded-full border border-(--gold)/50 bg-white/90 px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-(--rose-gold)"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.05 }}
        >
          Résultats 🎊
        </motion.span>
        <h2 className="host-results-question wedding-title mx-auto mt-[clamp(0.25rem,1vh,0.75rem)] max-w-5xl text-balance">
          {questionText}
        </h2>
      </motion.div>

      <div className="grid min-h-0 flex-1 grid-cols-2 items-stretch gap-[clamp(1rem,3vw,2rem)]">
        <HostResultColumn
          side="elle"
          questionId={questionId}
          percent={ellePercent}
          count={result.elle}
          isWinner={winner === "elle"}
          animationVariant={hostSlideIn.elle}
          revealDelayMs={350}
        />
        <HostResultColumn
          side="lui"
          questionId={questionId}
          percent={luiPercent}
          count={result.lui}
          isWinner={winner === "lui"}
          animationVariant={hostSlideIn.lui}
          revealDelayMs={500}
        />
      </div>

      <motion.p
        className="shrink-0 text-center text-[clamp(0.7rem,1.2vmin,0.875rem)] font-bold text-(--ink-muted)"
        variants={hostFadeUp}
      >
        {result.total} vote{result.total > 1 ? "s" : ""}
        {winner ? (
          <>
            {" "}
            ·{" "}
            {winner === "elle" ? (
              <motion.span
                className="inline-block text-pink-600"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.12, 1], opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                {COUPLE.elle} gagne ! 🏆
              </motion.span>
            ) : (
              <motion.span
                className="inline-block text-sky-600"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.12, 1], opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                {COUPLE.lui} gagne ! 🏆
              </motion.span>
            )}
          </>
        ) : (
          <motion.span
            className="inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            {" "}
            · Égalité parfaite !
          </motion.span>
        )}
      </motion.p>
    </motion.div>
  );
}

function HostResultColumn({
  side,
  questionId,
  percent,
  count,
  isWinner,
  animationVariant,
  revealDelayMs,
}: {
  side: "elle" | "lui";
  questionId: number;
  percent: number;
  count: number;
  isWinner: boolean;
  animationVariant: typeof hostSlideIn.elle;
  revealDelayMs: number;
}) {
  const isElle = side === "elle";
  const animatedPercent = useAnimatedPercent(percent, revealDelayMs);

  return (
    <motion.div
      className={[
        "grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto_auto] overflow-hidden rounded-3xl bg-white/80 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)]",
        isWinner ? "ring-[3px] ring-(--gold)" : "",
      ].join(" ")}
      variants={animationVariant}
      animate={
        isWinner
          ? {
              boxShadow: [
                "0 4px 0 rgba(212,168,83,0.35)",
                "0 6px 28px rgba(212,168,83,0.45)",
                "0 4px 0 rgba(212,168,83,0.35)",
              ],
            }
          : undefined
      }
      transition={
        isWinner
          ? { delay: 1, duration: 1.2, repeat: 2, ease: "easeInOut" }
          : undefined
      }
    >
      <div className="relative min-h-[clamp(8rem,28vh,18rem)] overflow-hidden">
        <ChoiceAvatar
          choice={side}
          questionId={questionId}
          variant="cover"
        />
        {isWinner ? (
          <motion.span
            className="absolute top-3 right-3 text-[clamp(1.5rem,4vmin,2.5rem)] drop-shadow-md"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 12,
              delay: 1.05,
            }}
          >
            🏆
          </motion.span>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col items-center px-[clamp(0.5rem,1.5vw,1rem)] py-[clamp(0.5rem,1.5vh,0.75rem)]">
        <motion.span
          className={[
            "font-extrabold tabular-nums leading-none",
            isElle ? "text-pink-600" : "text-sky-600",
            "text-[clamp(2rem,10vmin,5rem)]",
          ].join(" ")}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 18,
            delay: revealDelayMs / 1000 + 0.15,
          }}
        >
          {animatedPercent}
          <span className="text-[0.45em]">%</span>
        </motion.span>
        <motion.span
          className="mt-0.5 text-[clamp(0.7rem,1.3vmin,0.875rem)] font-bold text-(--ink-muted)"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: revealDelayMs / 1000 + 0.35, duration: 0.35 }}
        >
          {count} vote{count > 1 ? "s" : ""}
        </motion.span>
      </div>

      <div
        className={[
          "shrink-0 overflow-hidden",
          isElle ? "bg-pink-100" : "bg-sky-100",
          "h-[clamp(0.5rem,1.5vh,0.75rem)]",
        ].join(" ")}
      >
        <motion.div
          className={[
            "h-full",
            isElle
              ? "bg-linear-to-r from-pink-400 to-rose-500"
              : "bg-linear-to-r from-sky-400 to-cyan-500",
          ].join(" ")}
          initial={{ width: "0%" }}
          animate={{ width: `${percent}%` }}
          transition={{
            duration: 0.9,
            ease: "easeOut",
            delay: revealDelayMs / 1000 + 0.2,
          }}
        />
      </div>
    </motion.div>
  );
}

function GuestResultsLayout({
  questionId,
  questionText,
  result,
  size,
}: {
  questionId: number;
  questionText: string;
  result: QuestionResult;
  size: "sm" | "lg";
}) {
  const isLarge = size === "lg";
  const ellePercent = getPercent(result.elle, result.total);
  const luiPercent = getPercent(result.lui, result.total);
  const winner =
    ellePercent > luiPercent
      ? "elle"
      : luiPercent > ellePercent
        ? "lui"
        : null;

  return (
    <motion.div
      key={questionText}
      className={["flex w-full flex-col", isLarge ? "gap-6" : "gap-6"].join(" ")}
      initial="hidden"
      animate="visible"
      variants={guestStagger}
    >
      <motion.div
        className={[
          "wedding-card text-center",
          isLarge ? "p-10" : "p-6",
        ].join(" ")}
        variants={guestFadeUp}
      >
        <p className="wedding-label">Résultats 🎊</p>
        <h2
          className={[
            "wedding-title mt-3 leading-snug",
            isLarge ? "text-3xl md:text-5xl" : "text-2xl",
          ].join(" ")}
        >
          {questionText}
        </h2>
      </motion.div>
      <GuestResultBar
        choice="elle"
        questionId={questionId}
        percent={ellePercent}
        count={result.elle}
        isWinner={winner === "elle"}
        barClass="bg-linear-to-r from-pink-400 to-rose-400"
        trackClass="bg-pink-100"
        isLarge={isLarge}
      />
      <GuestResultBar
        choice="lui"
        questionId={questionId}
        percent={luiPercent}
        count={result.lui}
        isWinner={winner === "lui"}
        barClass="bg-linear-to-r from-sky-400 to-cyan-400"
        trackClass="bg-sky-100"
        isLarge={isLarge}
      />
      <motion.p
        className={[
          "text-center font-semibold text-(--ink-muted)",
          isLarge ? "text-xl" : "text-sm",
        ].join(" ")}
        variants={guestFadeUp}
      >
        {result.total} vote{result.total > 1 ? "s" : ""} · Qui connaît le
        mieux le couple ? 😏
      </motion.p>
    </motion.div>
  );
}

type GuestResultBarProps = {
  choice: "elle" | "lui";
  questionId: number;
  percent: number;
  count: number;
  isWinner: boolean;
  barClass: string;
  trackClass: string;
  isLarge: boolean;
};

function GuestResultBar({
  choice,
  questionId,
  percent,
  count,
  isWinner,
  barClass,
  trackClass,
  isLarge,
}: GuestResultBarProps) {
  const isElle = choice === "elle";

  return (
    <motion.div
      className={[
        "overflow-hidden rounded-3xl bg-white/60 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.12)]",
        isWinner ? "ring-2 ring-(--gold)" : "",
      ].join(" ")}
      variants={guestFadeUp}
    >
      <div className="flex items-stretch gap-3 p-3">
        <div
          className={[
            "relative shrink-0 overflow-hidden rounded-2xl shadow-sm",
            isLarge ? "h-28 w-[4.5rem]" : "h-[4.5rem] w-16",
          ].join(" ")}
        >
          <ChoiceAvatar choice={choice} questionId={questionId} variant="cover" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <div
            className={[
              "flex items-center justify-between",
              isLarge ? "text-xl" : "text-sm",
            ].join(" ")}
          >
            <span
              className={[
                "font-extrabold tabular-nums",
                isElle ? "text-pink-600" : "text-sky-600",
              ].join(" ")}
            >
              {percent}%
              {isWinner ? (
                <motion.span
                  className="ml-1.5 inline-block"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 16,
                    delay: 0.35,
                  }}
                >
                  🏆
                </motion.span>
              ) : null}
            </span>
            <span className="font-bold text-(--ink-muted)">
              {count} vote{count > 1 ? "s" : ""}
            </span>
          </div>
          <div
            className={[
              "overflow-hidden rounded-full",
              trackClass,
              isLarge ? "h-6" : "h-3.5",
            ].join(" ")}
          >
            <motion.div
              className={["h-full rounded-full", barClass].join(" ")}
              initial={{ width: "0%" }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
