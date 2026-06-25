"use client";

import { useEffect, useRef } from "react";

type HostAdminMenuProps = {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  onReset?: () => void;
  showReset?: boolean;
  isActing?: boolean;
};

export function HostAdminMenu({
  open,
  onClose,
  onLogout,
  onReset,
  showReset = false,
  isActing = false,
}: HostAdminMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("[data-host-menu-trigger]")) return;
      if (!ref.current?.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-1 min-w-44 overflow-hidden rounded-xl border border-(--gold)/40 bg-white shadow-lg"
    >
      {showReset && onReset ? (
        <button
          type="button"
          disabled={isActing}
          onClick={() => {
            onClose();
            onReset();
          }}
          className="w-full cursor-pointer px-4 py-2.5 text-left text-sm font-semibold text-rose-600 first:rounded-t-xl hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-55"
        >
          Recommencer
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => {
          onClose();
          onLogout();
        }}
        className="w-full cursor-pointer px-4 py-2.5 text-left text-sm font-semibold text-(--ink-muted) first:rounded-t-xl last:rounded-b-xl hover:bg-stone-50"
      >
        Se déconnecter
      </button>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      data-host-menu-trigger={label === "Menu animateur" ? true : undefined}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-(--gold)/40 bg-white/80 text-(--ink) transition hover:bg-(--gold-light)/60"
    >
      {children}
    </button>
  );
}

function QrIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 3h2v2h-2v-2Zm4 0h2v2h-2v-2Zm-4-4h2v2h-2v-2Zm4 0h2v2h-2v-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FullscreenIcon({ exit }: { exit: boolean }) {
  if (exit) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M9 4H4v5M20 9V4h-5M4 15v5h5M15 20h5v-5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 4H4v4M20 8V4h-4M4 16v4h4M16 20h4v-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

type HostRoomHeaderProps = {
  code: string;
  isFullscreen: boolean;
  onToggleMenu: () => void;
  onToggleFullscreen: () => void;
  onToggleQr: () => void;
};

export function HostRoomHeader({
  code,
  isFullscreen,
  onToggleMenu,
  onToggleFullscreen,
  onToggleQr,
}: HostRoomHeaderProps) {
  if (isFullscreen) return null;

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-(--gold)/30 bg-white/60 px-3 py-1.5 backdrop-blur-sm">
      <p className="font-mono text-sm font-extrabold tracking-[0.25em] text-(--ink)">
        {code}
      </p>
      <div className="flex items-center gap-1.5">
        <IconButton label="Afficher le QR code" onClick={onToggleQr}>
          <QrIcon />
        </IconButton>
        <IconButton label="Plein écran" onClick={onToggleFullscreen}>
          <FullscreenIcon exit={false} />
        </IconButton>
        <div className="relative">
          <IconButton label="Menu animateur" onClick={onToggleMenu}>
            <MenuIcon />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

export function HostFloatingControls({
  isFullscreen,
  onToggleMenu,
  onToggleFullscreen,
}: {
  isFullscreen: boolean;
  onToggleMenu: () => void;
  onToggleFullscreen: () => void;
}) {
  if (!isFullscreen) return null;

  return (
    <div className="pointer-events-none fixed right-3 top-3 z-40 flex gap-1.5 opacity-25 transition-opacity hover:opacity-100">
      <div className="pointer-events-auto relative">
        <IconButton label="Quitter le plein écran" onClick={onToggleFullscreen}>
          <FullscreenIcon exit />
        </IconButton>
      </div>
      <div className="pointer-events-auto relative">
        <IconButton label="Menu animateur" onClick={onToggleMenu}>
          <MenuIcon />
        </IconButton>
      </div>
    </div>
  );
}
