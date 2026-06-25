import { NextResponse } from "next/server";
import { generateRoomCode } from "@/lib/game";
import { serverErrorResponse } from "@/lib/api-error";
import {
  getActiveSession,
  mapSession,
  unauthorizedResponse,
  verifyHostPassword,
} from "@/lib/game-session";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const password = request.headers.get("x-host-password");
    const auth = verifyHostPassword(password);

    if (!auth.ok) {
      return unauthorizedResponse(auth.error);
    }

    let session = await getActiveSession();

    if (!session) {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from("game_sessions")
        .insert({ code: generateRoomCode() })
        .select("*")
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: error?.message ?? "Impossible de créer la session" },
          { status: 500 },
        );
      }

      session = data;
    }

    if (!session) {
      return NextResponse.json({ error: "Session introuvable" }, { status: 404 });
    }

    return NextResponse.json({ session: mapSession(session) });
  } catch (error) {
    return serverErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const password = request.headers.get("x-host-password");
    const auth = verifyHostPassword(password);

    if (!auth.ok) {
      return unauthorizedResponse(auth.error);
    }

    const body = await request.json();
    const session = await getActiveSession();

    if (!session) {
      return NextResponse.json({ error: "Aucune session active" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.action === "start") {
      updates.phase = "voting";
      updates.current_question_index = 0;
      updates.voting_started_at = new Date().toISOString();
      updates.show_qr = false;
    }

    if (body.action === "show_results") {
      updates.phase = "results";
    }

    if (body.action === "next") {
      const nextIndex = session.current_question_index + 1;

      if (nextIndex >= 20) {
        return NextResponse.json(
          { error: "Dernière question atteinte" },
          { status: 400 },
        );
      }

      updates.phase = "voting";
      updates.current_question_index = nextIndex;
      updates.voting_started_at = new Date().toISOString();
    }

    if (body.action === "finish") {
      updates.phase = "finished";
    }

    if (body.action === "toggle_qr") {
      updates.show_qr = Boolean(body.showQr);
    }

    if (body.action === "reset") {
      const supabase = createServerClient();
      await supabase.from("votes").delete().eq("game_session_id", session.id);
      await supabase
        .from("participants")
        .delete()
        .eq("game_session_id", session.id);

      updates.phase = "lobby";
      updates.current_question_index = 0;
      updates.voting_started_at = null;
      updates.show_qr = false;
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("game_sessions")
      .update(updates)
      .eq("id", session.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ session: mapSession(data) });
  } catch (error) {
    return serverErrorResponse(error);
  }
}
