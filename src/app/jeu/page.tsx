"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { COUPLE, type Choice } from "@/data/couple";
import { QUESTIONS } from "@/data/questions";
import { QuestionCard } from "@/components/QuestionCard";
import { getSessionId } from "@/lib/session";

export default function JeuPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scores, setScores] = useState({ elle: 0, lui: 0 });
  const [isFinished, setIsFinished] = useState(false);

  const question = QUESTIONS[currentIndex];

  const handleSelect = useCallback(
    async (choice: Choice) => {
      if (isSubmitting || isFinished) {
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: question.id,
            choice,
            sessionId: getSessionId(),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Impossible d'enregistrer le vote");
        }

        setScores((prev) => ({
          ...prev,
          [choice]: prev[choice] + 1,
        }));

        if (currentIndex >= QUESTIONS.length - 1) {
          setIsFinished(true);
          return;
        }

        setCurrentIndex((prev) => prev + 1);
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Une erreur est survenue",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentIndex, isFinished, isSubmitting, question.id],
  );

  if (isFinished) {
    return (
      <main className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col justify-center px-6 py-10">
        <div className="rounded-[2rem] border border-amber-200/80 bg-white/90 p-8 text-center shadow-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-700">
            Merci !
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-stone-900">
            Tes réponses sont enregistrées
          </h1>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-rose-50 p-4">
              <p className="text-sm text-rose-700">Elle · {COUPLE.elle}</p>
              <p className="mt-1 text-3xl font-semibold text-rose-900">
                {scores.elle}
              </p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <p className="text-sm text-sky-700">Lui · {COUPLE.lui}</p>
              <p className="mt-1 text-3xl font-semibold text-sky-900">
                {scores.lui}
              </p>
            </div>
          </div>
          <Link
            href="/resultats"
            className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-6 py-4 font-semibold text-white"
          >
            Voir les résultats des invités
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col justify-center px-6 py-10">
      <QuestionCard
        question={question}
        currentIndex={currentIndex + 1}
        total={QUESTIONS.length}
        onSelect={handleSelect}
        isSubmitting={isSubmitting}
      />
      {error ? (
        <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </main>
  );
}
