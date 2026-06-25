import { NextResponse } from "next/server";
import { isVotingOpen } from "@/lib/game";
import { getSessionByCode } from "@/lib/game-session";
import { createServerClient } from "@/lib/supabase/server";
import { COUPLE } from "@/data/couple";
import { QUESTIONS } from "@/data/questions";
import type { VotePayload } from "@/types";

function isValidPayload(body: unknown): body is VotePayload {
  if (!body || typeof body !== "object") {
    return false;
  }

  const { gameSessionCode, questionId, choice, sessionId } = body as VotePayload;

  return (
    typeof gameSessionCode === "string" &&
    gameSessionCode.length > 0 &&
    typeof questionId === "number" &&
    QUESTIONS.some((question) => question.id === questionId) &&
    (choice === "elle" || choice === "lui") &&
    typeof sessionId === "string" &&
    sessionId.length > 0
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isValidPayload(body)) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const session = await getSessionByCode(body.gameSessionCode);

    if (!session) {
      return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
    }

    if (session.phase !== "voting") {
      return NextResponse.json(
        { error: "Le vote n'est pas ouvert" },
        { status: 403 },
      );
    }

    const currentQuestion = QUESTIONS[session.current_question_index];

    if (currentQuestion.id !== body.questionId) {
      return NextResponse.json(
        { error: "Cette question n'est plus active" },
        { status: 403 },
      );
    }

    if (!isVotingOpen(session.voting_started_at)) {
      return NextResponse.json({ error: "Temps écoulé" }, { status: 403 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from("votes").upsert(
      {
        game_session_id: session.id,
        question_id: body.questionId,
        choice: body.choice,
        session_id: body.sessionId,
      },
      { onConflict: "game_session_id,question_id,session_id" },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      choice: body.choice,
      name: COUPLE[body.choice],
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
