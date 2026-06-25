export const VOTING_DURATION_MS = 20_000;
export const PARTICIPANT_TTL_MS = 30_000;
export const HEARTBEAT_INTERVAL_MS = 10_000;
export const STATS_POLL_INTERVAL_MS = 2_000;

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateRoomCode(length = 5) {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export function getRemainingMs(votingStartedAt: string | null, now = Date.now()) {
  if (!votingStartedAt) {
    return VOTING_DURATION_MS;
  }

  const elapsed = now - new Date(votingStartedAt).getTime();
  return Math.max(0, VOTING_DURATION_MS - elapsed);
}

export function isVotingOpen(votingStartedAt: string | null, now = Date.now()) {
  if (!votingStartedAt) {
    return false;
  }

  return getRemainingMs(votingStartedAt, now) > 0;
}

export function getPercent(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export function getJoinUrl(code: string) {
  if (typeof window === "undefined") {
    return `/s/${code}`;
  }

  return `${window.location.origin}/s/${code}`;
}
