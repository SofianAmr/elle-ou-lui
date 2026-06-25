"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COUPLE } from "@/data/couple";
import { QUESTIONS } from "@/data/questions";
import type { ResultsResponse } from "@/types";

function getPercent(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export default function ResultatsPage() {
  const [data, setData] = useState<ResultsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await fetch("/api/results");
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error ?? "Impossible de charger les résultats");
        }

        setData(json);
        setError(null);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Une erreur est survenue",
        );
      }
    }

    fetchResults();
    const interval = setInterval(fetchResults, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-amber-700">
            Live
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900">
            Résultats des invités
          </h1>
          <p className="mt-2 text-stone-500">
            {data ? `${data.totalVotes} votes enregistrés` : "Chargement..."}
          </p>
        </div>
        <Link
          href="/jeu"
          className="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700"
        >
          Jouer
        </Link>
      </div>

      {error ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="space-y-4">
        {QUESTIONS.map((question) => {
          const result = data?.results.find(
            (item) => item.questionId === question.id,
          );
          const ellePercent = getPercent(result?.elle ?? 0, result?.total ?? 0);
          const luiPercent = getPercent(result?.lui ?? 0, result?.total ?? 0);

          return (
            <article
              key={question.id}
              className="rounded-3xl border border-stone-200 bg-white/90 p-5 shadow-sm"
            >
              <h2 className="text-lg font-medium text-stone-800">
                {question.text}
              </h2>
              <div className="mt-4 space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-rose-700">
                      {COUPLE.elle} · Elle
                    </span>
                    <span>{ellePercent}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-rose-400 transition-all"
                      style={{ width: `${ellePercent}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-sky-700">{COUPLE.lui} · Lui</span>
                    <span>{luiPercent}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-sky-400 transition-all"
                      style={{ width: `${luiPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
