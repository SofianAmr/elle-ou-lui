export const COUPLE = {
  elle: "Soumaya",
  lui: "Florent",
} as const;

export type Choice = keyof typeof COUPLE;
