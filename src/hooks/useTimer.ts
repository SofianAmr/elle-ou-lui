"use client";

import { useSyncExternalStore } from "react";
import { VOTING_DURATION_MS } from "@/lib/game";

let cachedNow = Date.now();
let tickIntervalId: ReturnType<typeof setInterval> | null = null;
const tickListeners = new Set<() => void>();

function subscribeToTicks(onStoreChange: () => void) {
  tickListeners.add(onStoreChange);

  if (tickIntervalId === null) {
    cachedNow = Date.now();
    tickIntervalId = setInterval(() => {
      cachedNow = Date.now();
      tickListeners.forEach((listener) => listener());
    }, 100);
  }

  return () => {
    tickListeners.delete(onStoreChange);
    if (tickListeners.size === 0 && tickIntervalId !== null) {
      clearInterval(tickIntervalId);
      tickIntervalId = null;
    }
  };
}

function getCachedNow() {
  return cachedNow;
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
    votingStartedAt ? getCachedNow : getServerNow,
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
