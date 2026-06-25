import { NextResponse } from "next/server";
import { verifyHostPassword } from "@/lib/game-session";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const result = verifyHostPassword(typeof password === "string" ? password : null);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
