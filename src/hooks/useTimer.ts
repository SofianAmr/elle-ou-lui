"use client";

import { useSyncExternalStore } from "react";
import { VOTING_DURATION_MS } from "@/lib/game";

function subscribeToTicks(onStoreChange: () => void) {
  const interval = setInterval(onStoreChange, 100);
  return () => clearInterval(interval);
}

function getNow() {
  return Date.now();
}

function getServerNow() {
  return 0;
}

export function useTimer(votingStartedAt: string | null) {
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const now = useSyncExternalStore(
    votingStartedAt ? subscribeToTicks : () => () => {},
    getNow,
    getServerNow,
  );

  if (!votingStartedAt || !isClient) {
    return {
      remainingMs: VOTING_DURATION_MS,
      remainingSeconds: Math.ceil(VOTING_DURATION_MS / 1000),
      progress: 0,
      isExpired: false,
    };
  }

  const startedAt = new Date(votingStartedAt).getTime();
  const elapsed = now - startedAt;
  const remainingMs = Math.max(0, VOTING_DURATION_MS - elapsed);

  return {
    remainingMs,
    remainingSeconds: Math.ceil(remainingMs / 1000),
    progress: 1 - remainingMs / VOTING_DURATION_MS,
    isExpired: remainingMs <= 0,
  };
}
