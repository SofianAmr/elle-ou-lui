"use client";

import { useEffect, useState } from "react";
import { STATS_POLL_INTERVAL_MS } from "@/lib/game";
import type { SessionStats } from "@/types";

export function useSessionStats(code: string | null, enabled = true) {
  const [stats, setStats] = useState<SessionStats>({
    connectedCount: 0,
    voteCount: 0,
  });

  useEffect(() => {
    if (!code || !enabled) {
      return;
    }

    async function fetchStats() {
      const response = await fetch(`/api/session/${code}/stats`);
      const data = await response.json();

      if (response.ok) {
        setStats({
          connectedCount: data.connectedCount,
          voteCount: data.voteCount,
        });
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, STATS_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [code, enabled]);

  return stats;
}
