"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribeFullscreen(onStoreChange: () => void) {
  document.addEventListener("fullscreenchange", onStoreChange);
  return () => document.removeEventListener("fullscreenchange", onStoreChange);
}

function getIsFullscreen() {
  return Boolean(document.fullscreenElement);
}

export function useFullscreen() {
  const isFullscreen = useSyncExternalStore(
    subscribeFullscreen,
    getIsFullscreen,
    () => false,
  );

  const toggle = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Plein écran non supporté ou refusé
    }
  }, []);

  return { isFullscreen, toggle };
}
