import { NextResponse } from "next/server";
import { getSessionByCode } from "@/lib/game-session";
import { createServerClient } from "@/lib/supabase/server";
import { QUESTIONS } from "@/data/questions";
import type { QuestionResult } from "@/types";

type RouteContext = {
  params: Promise<{ code: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { code } = await context.params;
    const session = await getSessionByCode(code);

    if (!session) {
      return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const questionIdParam = searchParams.get("questionId");
    const questionId = questionIdParam
      ? Number(questionIdParam)
      : QUESTIONS[session.current_question_index].id;

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("votes")
      .select("choice")
      .eq("game_session_id", session.id)
      .eq("question_id", questionId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const elle = data?.filter((row) => row.choice === "elle").length ?? 0;
    const lui = data?.filter((row) => row.choice === "lui").length ?? 0;

    const result: QuestionResult = {
      questionId,
      elle,
      lui,
      total: elle + lui,
    };

    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
