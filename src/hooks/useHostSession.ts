"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { getHostPassword } from "@/lib/host-auth";
import type { GameSession } from "@/types";

type HostAction =
  | "start"
  | "show_results"
  | "next"
  | "finish"
  | "toggle_qr"
  | "reset";

export function useHostSession() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    const password = getHostPassword();

    if (!password) {
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);

    const response = await fetch("/api/host/session", {
      headers: { "x-host-password": password },
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Impossible de charger la session");
      setSession(null);
      setIsLoading(false);
      return null;
    }

    setSession(data.session);
    setError(null);
    setIsLoading(false);
    return data.session as GameSession;
  }, []);

  const performAction = useCallback(
    async (action: HostAction, extra?: { showQr?: boolean }) => {
      const password = getHostPassword();
      const response = await fetch("/api/host/session", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-host-password": password,
        },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Action impossible");
      }

      setSession(data.session);
      return data.session as GameSession;
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;

    async function load() {
      const password = getHostPassword();

      if (!password) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }

      const response = await fetch("/api/host/session", {
        headers: { "x-host-password": password },
      });
      const data = await response.json();

      if (!isMounted) {
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Impossible de charger la session");
        setSession(null);
        setIsLoading(false);
        return;
      }

      setSession(data.session);
      setError(null);
      setIsLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!session?.code) {
      return;
    }

    const supabase = createBrowserClient();
    const channel = supabase
      .channel(`host-session-${session.code}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_sessions",
          filter: `code=eq.${session.code}`,
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
      supabase.removeChannel(channel);
    };
  }, [session?.code]);

  return { session, isLoading, error, loadSession, performAction };
}
