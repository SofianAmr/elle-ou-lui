const SESSION_KEY = "elle-ou-lui-session";

export function getSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const existing = localStorage.getItem(SESSION_KEY);
  if (existing) {
    return existing;
  }

  const sessionId = crypto.randomUUID();
  localStorage.setItem(SESSION_KEY, sessionId);
  return sessionId;
}
