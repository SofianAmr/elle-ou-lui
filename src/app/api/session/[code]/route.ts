import { NextResponse } from "next/server";
import { getSessionByCode, mapSession } from "@/lib/game-session";

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

    return NextResponse.json({ session: mapSession(session) });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
