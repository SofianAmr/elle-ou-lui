import { NextResponse } from "next/server";
import { COUPLE } from "@/data/couple";
import { QUESTIONS } from "@/data/questions";
import { createServerClient } from "@/lib/supabase/server";
import type { VotePayload } from "@/types";

function isValidPayload(body: unknown): body is VotePayload {
  if (!body || typeof body !== "object") {
    return false;
  }

  const { questionId, choice, sessionId } = body as VotePayload;

  return (
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

    const supabase = createServerClient();
    const { error } = await supabase.from("votes").insert({
      question_id: body.questionId,
      choice: body.choice,
      session_id: body.sessionId,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Tu as déjà répondu à cette question" },
          { status: 409 },
        );
      }

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
