import type { Choice } from "@/data/couple";

export type GamePhase = "lobby" | "voting" | "results" | "finished";

export type GameSession = {
  id: string;
  code: string;
  phase: GamePhase;
  currentQuestionIndex: number;
  votingStartedAt: string | null;
  showQr: boolean;
};

export type VotePayload = {
  gameSessionCode: string;
  questionId: number;
  choice: Choice;
  sessionId: string;
};

export type QuestionResult = {
  questionId: number;
  elle: number;
  lui: number;
  total: number;
};

export type SessionStats = {
  connectedCount: number;
  voteCount: number;
};
