import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import type { GamePhase, GameSession } from "@/types";

export type GameSessionRow = {
  id: string;
  code: string;
  phase: GamePhase;
  current_question_index: number;
  voting_started_at: string | null;
  show_qr: boolean;
};

export function mapSession(row: GameSessionRow): GameSession {
  return {
    id: row.id,
    code: row.code,
    phase: row.phase,
    currentQuestionIndex: row.current_question_index,
    votingStartedAt: row.voting_started_at,
    showQr: row.show_qr,
  };
}

export function verifyHostPassword(password: string | null) {
  const expected = process.env.HOST_PASSWORD;

  if (!expected) {
    return { ok: false as const, error: "HOST_PASSWORD non configuré" };
  }

  if (!password || password !== expected) {
    return { ok: false as const, error: "Mot de passe incorrect" };
  }

  return { ok: true as const };
}

export function unauthorizedResponse(message = "Non autorisé") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export async function getSessionByCode(code: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("code", code.toUpperCase())
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as GameSessionRow | null;
}

export async function getActiveSession() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("game_sessions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as GameSessionRow | null;
}
