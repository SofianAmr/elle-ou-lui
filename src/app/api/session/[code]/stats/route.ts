import { NextResponse } from "next/server";
import { PARTICIPANT_TTL_MS } from "@/lib/game";
import { getSessionByCode } from "@/lib/game-session";
import { createServerClient } from "@/lib/supabase/server";
import { QUESTIONS } from "@/data/questions";

type RouteContext = {
  params: Promise<{ code: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { code } = await context.params;
    const session = await getSessionByCode(code);

    if (!session) {
      return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
    }

    const supabase = createServerClient();
    const cutoff = new Date(Date.now() - PARTICIPANT_TTL_MS).toISOString();

    const [{ count: connectedCount }, { count: voteCount }] = await Promise.all([
      supabase
        .from("participants")
        .select("*", { count: "exact", head: true })
        .eq("game_session_id", session.id)
        .gte("last_seen_at", cutoff),
      supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("game_session_id", session.id)
        .eq("question_id", QUESTIONS[session.current_question_index].id),
    ]);

    return NextResponse.json({
      connectedCount: connectedCount ?? 0,
      voteCount: voteCount ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
