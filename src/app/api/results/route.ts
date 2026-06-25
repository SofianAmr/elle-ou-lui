import { NextResponse } from "next/server";
import { QUESTIONS } from "@/data/questions";
import { createServerClient } from "@/lib/supabase/server";
import type { QuestionResult, ResultsResponse } from "@/types";

type VoteRow = {
  question_id: number;
  choice: "elle" | "lui";
};

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("votes")
      .select("question_id, choice");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = (data ?? []) as VoteRow[];
    const results: QuestionResult[] = QUESTIONS.map((question) => {
      const questionVotes = rows.filter(
        (row) => row.question_id === question.id,
      );
      const elle = questionVotes.filter((row) => row.choice === "elle").length;
      const lui = questionVotes.filter((row) => row.choice === "lui").length;

      return {
        questionId: question.id,
        elle,
        lui,
        total: elle + lui,
      };
    });

    const response: ResultsResponse = {
      results,
      totalVotes: rows.length,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
