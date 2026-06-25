import Link from "next/link";
import { COUPLE } from "@/data/couple";
import { QUESTIONS } from "@/data/questions";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col justify-center px-6 py-10">
      <div className="rounded-[2rem] border border-amber-200/80 bg-white/90 p-8 text-center shadow-xl backdrop-blur">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-700">
          Jeu des invités
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-stone-900">
          Elle ou Lui ?
        </h1>
        <p className="mt-4 text-lg text-stone-600">
          {COUPLE.elle} & {COUPLE.lui}
        </p>
        <p className="mt-6 text-stone-500">
          {QUESTIONS.length} questions pour deviner qui est qui. Réponds depuis
          ton téléphone et découvre ce que pensent les invités.
        </p>
        <Link
          href="/jeu"
          className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-amber-500 px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-amber-600"
        >
          Commencer
        </Link>
        <Link
          href="/resultats"
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-stone-700 transition hover:bg-stone-50"
        >
          Voir les résultats live
        </Link>
      </div>
    </main>
  );
}
