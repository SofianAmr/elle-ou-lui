"use client";

import QRCode from "react-qr-code";
import { getJoinUrl } from "@/lib/game";

type RoomHeaderProps = {
  code: string;
  onToggleQr?: () => void;
  showQrButton?: boolean;
  compact?: boolean;
};

export function RoomHeader({
  code,
  onToggleQr,
  showQrButton = false,
  compact = false,
}: RoomHeaderProps) {
  return (
    <header
      className={[
        "flex shrink-0 items-center justify-between gap-4 border-b-2 border-dashed border-(--gold)/40 bg-white/75 backdrop-blur",
        compact ? "px-4 py-2" : "px-6 py-4",
      ].join(" ")}
    >
      <div>
        <p className="wedding-label text-[0.6rem]">Code salle</p>
        <p
          className={[
            "font-mono font-extrabold tracking-[0.3em] text-(--ink)",
            compact ? "text-lg" : "mt-1 text-2xl tracking-[0.35em]",
          ].join(" ")}
        >
          {code}
        </p>
      </div>
      {showQrButton && onToggleQr ? (
        <button
          type="button"
          onClick={onToggleQr}
          className={[
            "btn-secondary",
            compact ? "px-3 py-1.5 text-xs" : "px-5 py-2 text-sm",
          ].join(" ")}
        >
          📱 QR code
        </button>
      ) : null}
    </header>
  );
}

type QrOverlayProps = {
  code: string;
  connectedCount?: number;
  onClose: () => void;
};

export function QrOverlay({ code, connectedCount, onClose }: QrOverlayProps) {
  const joinUrl = getJoinUrl(code);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--ink)/75 p-6 backdrop-blur-sm">
      <div className="wedding-card w-full max-w-lg p-10 text-center">
        <p className="wedding-label">Rejoins la fête 💍</p>
        <p className="mt-4 font-mono text-4xl font-extrabold tracking-[0.3em] text-(--ink)">
          {code}
        </p>
        {connectedCount !== undefined ? (
          <p className="mt-4 rounded-2xl border-2 border-dashed border-(--gold)/50 bg-white/60 px-6 py-3 text-base font-extrabold text-(--ink)">
            {connectedCount} personne
            {connectedCount > 1 ? "s" : ""} connectée
            {connectedCount > 1 ? "s" : ""}
          </p>
        ) : null}
        <div className="mx-auto mt-8 flex justify-center rounded-3xl border-2 border-dashed border-(--gold)/50 bg-white p-6">
          <QRCode value={joinUrl} size={220} />
        </div>
        <p className="mt-6 break-all text-sm text-(--ink-muted)">{joinUrl}</p>
        <button type="button" onClick={onClose} className="btn-primary mt-8">
          Fermer
        </button>
      </div>
    </div>
  );
}
