"use client";

import { useEffect } from "react";
import { HEARTBEAT_INTERVAL_MS } from "@/lib/game";
import { useHostAuthenticated } from "@/lib/host-auth";
import { getSessionId } from "@/lib/session";

export function useParticipant(
  gameSessionCode: string | null,
  options?: { asHost?: boolean },
) {
  const isAuthenticatedHost = useHostAuthenticated();
  const isHost = options?.asHost ?? isAuthenticatedHost;

  useEffect(() => {
    if (!gameSessionCode) {
      return;
    }

    const sessionId = getSessionId();

    async function heartbeat() {
      await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameSessionCode, sessionId, isHost }),
      });
    }

    heartbeat();
    const interval = setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [gameSessionCode, isHost]);
}
