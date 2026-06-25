"use client";

import { useEffect } from "react";
import { HEARTBEAT_INTERVAL_MS } from "@/lib/game";
import { getSessionId } from "@/lib/session";

export function useParticipant(gameSessionCode: string | null) {
  useEffect(() => {
    if (!gameSessionCode) {
      return;
    }

    const sessionId = getSessionId();

    async function heartbeat() {
      await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameSessionCode, sessionId }),
      });
    }

    heartbeat();
    const interval = setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [gameSessionCode]);
}
