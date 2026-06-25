import type { Choice } from "@/data/couple";

export type VotePayload = {
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

export type ResultsResponse = {
  results: QuestionResult[];
  totalVotes: number;
};
