"use client";

import { useSyncExternalStore } from "react";

const HOST_PASSWORD_KEY = "elle-ou-lui-host-password";

const authListeners = new Set<() => void>();

function notifyAuthListeners() {
  authListeners.forEach((listener) => listener());
}

function subscribeHostAuth(onStoreChange: () => void) {
  authListeners.add(onStoreChange);
  return () => authListeners.delete(onStoreChange);
}

export function getHostPassword() {
  if (typeof window === "undefined") {
    return "";
  }

  return sessionStorage.getItem(HOST_PASSWORD_KEY) ?? "";
}

export function setHostPassword(password: string) {
  sessionStorage.setItem(HOST_PASSWORD_KEY, password);
  notifyAuthListeners();
}

export function clearHostPassword() {
  sessionStorage.removeItem(HOST_PASSWORD_KEY);
  notifyAuthListeners();
}

export function useHostAuthenticated() {
  return useSyncExternalStore(
    subscribeHostAuth,
    () => Boolean(getHostPassword()),
    () => false,
  );
}
