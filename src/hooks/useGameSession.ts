"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import type { GameSession } from "@/types";

async function fetchSession(code: string): Promise<GameSession | null> {
  const response = await fetch(`/api/session/${code}`);
  const data = await response.json();

  if (!response.ok) {
    return null;
  }

  return data.session as GameSession;
}

export function useGameSession(code: string) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const nextSession = await fetchSession(code);

    if (!nextSession) {
      setError("Salle introuvable");
      setSession(null);
      return;
    }

    setSession(nextSession);
    setError(null);
  }, [code]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      const nextSession = await fetchSession(code);

      if (!isMounted) {
        return;
      }

      if (!nextSession) {
        setError("Salle introuvable");
        setSession(null);
      } else {
        setSession(nextSession);
        setError(null);
      }

      setIsLoading(false);
    }

    load();

    const supabase = createBrowserClient();
    const channel = supabase
      .channel(`session-${code}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_sessions",
          filter: `code=eq.${code.toUpperCase()}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            code: string;
            phase: GameSession["phase"];
            current_question_index: number;
            voting_started_at: string | null;
            show_qr: boolean;
          };

          setSession({
            id: row.id,
            code: row.code,
            phase: row.phase,
            currentQuestionIndex: row.current_question_index,
            votingStartedAt: row.voting_started_at,
            showQr: row.show_qr,
          });
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [code]);

  return { session, isLoading, error, refresh };
}
