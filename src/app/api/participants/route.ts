import { NextResponse } from "next/server";
import { getSessionByCode } from "@/lib/game-session";
import { createServerClient } from "@/lib/supabase/server";

function isValidBody(body: unknown): body is { gameSessionCode: string; sessionId: string } {
  if (!body || typeof body !== "object") {
    return false;
  }

  const { gameSessionCode, sessionId } = body as {
    gameSessionCode: string;
    sessionId: string;
  };

  return (
    typeof gameSessionCode === "string" &&
    gameSessionCode.length > 0 &&
    typeof sessionId === "string" &&
    sessionId.length > 0
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isValidBody(body)) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const session = await getSessionByCode(body.gameSessionCode);

    if (!session) {
      return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from("participants").upsert(
      {
        game_session_id: session.id,
        session_id: body.sessionId,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: "game_session_id,session_id" },
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
