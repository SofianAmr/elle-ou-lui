"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DecorativeBackground } from "@/components/DecorativeBackground";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const normalizedCode = code.trim().toUpperCase();

    if (normalizedCode.length < 4) {
      setError("Code invalide — vérifie le projecteur !");
      setIsLoading(false);
      return;
    }

    const response = await fetch(`/api/session/${normalizedCode}`);
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Salle introuvable");
      setIsLoading(false);
      return;
    }

    router.push(`/s/${normalizedCode}`);
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <DecorativeBackground />
      <main className="relative z-10 mx-auto flex min-h-full w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="wedding-card p-8"
        >
          <p className="wedding-label">Invité</p>
          <h1 className="wedding-title mt-3 text-4xl">Rejoindre la fête</h1>
          <p className="mt-4 text-(--ink-muted)">
            Entre le code affiché sur le projecteur ou scanne le QR code.
          </p>
          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="Ex. ELLE42"
            className="input-wedding mt-6 text-center font-mono text-2xl tracking-[0.3em] uppercase"
            autoComplete="off"
            autoCapitalize="characters"
          />
          {error ? (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary mt-6 w-full"
          >
            {isLoading ? "Connexion..." : "C'est parti ! 🥳"}
          </button>
        </form>
      </main>
    </div>
  );
}
