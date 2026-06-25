"use client";

import Link from "next/link";
import { COUPLE } from "@/data/couple";

type WaitingScreenProps = {
  title: string;
  subtitle: string;
  showConnected?: boolean;
};

export function WaitingScreen({
  title,
  subtitle,
  showConnected = true,
}: WaitingScreenProps) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="animate-float text-5xl">💍</div>
      <p className="wedding-label mt-6">
        {COUPLE.elle} & {COUPLE.lui}
      </p>
      <h1 className="wedding-title mt-4 text-4xl">{title}</h1>
      <p className="mt-4 max-w-md text-lg text-(--ink-muted)">{subtitle}</p>
      {showConnected ? (
        <p className="badge-connected mt-8">
          <span className="badge-connected-dot" />
          Connecté à la fête
        </p>
      ) : null}
      <Link
        href="/"
        className="mt-10 text-sm font-semibold text-(--ink-muted) underline-offset-4 transition hover:text-(--rose-gold) hover:underline"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
