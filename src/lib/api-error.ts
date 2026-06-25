import { NextResponse } from "next/server";

export function serverErrorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Erreur serveur inconnue";

  console.error("[API]", message);

  return NextResponse.json({ error: message }, { status: 500 });
}
