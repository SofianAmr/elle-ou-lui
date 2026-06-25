import Link from "next/link";
import { DecorativeBackground } from "@/components/DecorativeBackground";
import { COUPLE } from "@/data/couple";
import { QUESTIONS } from "@/data/questions";

export default function HomePage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <DecorativeBackground />
      <main className="relative z-10 mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col justify-center px-6 py-10">
        <div className="wedding-card p-8 text-center">
          <div className="animate-float text-5xl">💒</div>
          <p className="wedding-label mt-6">Jeu des invités</p>
          <h1 className="wedding-title mt-3 text-5xl italic">
            Elle ou Lui ?
          </h1>
          <p className="mt-4 text-xl font-bold text-(--rose-gold)">
            {COUPLE.elle} & {COUPLE.lui}
          </p>
          <p className="mt-6 text-(--ink-muted)">
            {`${QUESTIONS.length} questions en live. Ton téléphone pour voter, le grand écran pour juger — l'animateur ne fait que mettre le feu.`}
          </p>
          <Link href="/join" className="btn-primary mt-8 w-full">
            Je suis invité 🎉
          </Link>
          <Link href="/host" className="btn-secondary mt-4 w-full">
            Je suis animateur 🎤
          </Link>
        </div>
      </main>
    </div>
  );
}
