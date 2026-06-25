"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DecorativeBackground } from "@/components/DecorativeBackground";
import {
  HostAdminMenu,
  HostFloatingControls,
  HostRoomHeader,
} from "@/components/HostRoomHeader";
import { COUPLE } from "@/data/couple";
import { QUESTIONS } from "@/data/questions";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { GameFinishedScreen } from "@/components/GameFinishedScreen";
import { ResultsPanel } from "@/components/ResultsPanel";
import { QrOverlay } from "@/components/RoomHeader";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useHostSession } from "@/hooks/useHostSession";
import { useParticipant } from "@/hooks/useParticipant";
import { useQuestionResult } from "@/hooks/useQuestionResult";
import { useSessionStats } from "@/hooks/useSessionStats";
import { useTimer } from "@/hooks/useTimer";
import {
  clearHostPassword,
  setHostPassword,
  useHostAuthenticated,
} from "@/lib/host-auth";

export function HostDashboard() {
  const router = useRouter();
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isActing, setIsActing] = useState(false);
  const [showLocalQr, setShowLocalQr] = useState(false);
  const isAuthenticated = useHostAuthenticated();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

  const { session, isLoading, error, loadSession, performAction } =
    useHostSession();
  useParticipant(session?.code ?? null, { asHost: true });
  const stats = useSessionStats(session?.code ?? null, Boolean(session));
  const { remainingSeconds, progress, isExpired } = useTimer(
    session?.phase === "voting" ? session.votingStartedAt : null,
  );

  const question = session ? QUESTIONS[session.currentQuestionIndex] : null;
  const isLastQuestion = session?.currentQuestionIndex === QUESTIONS.length - 1;
  const { result } = useQuestionResult(
    session?.code ?? null,
    session?.phase === "results" ? (question?.id ?? null) : null,
  );

  const handleAuth = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setIsAuthenticating(true);
      setAuthError(null);

      try {
        const response = await fetch("/api/host/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: passwordInput }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Mot de passe incorrect");
        }

        setHostPassword(passwordInput);
        await loadSession();
      } catch (authErr) {
        setAuthError(
          authErr instanceof Error ? authErr.message : "Erreur de connexion",
        );
      } finally {
        setIsAuthenticating(false);
      }
    },
    [loadSession, passwordInput],
  );

  const runAction = useCallback(
    async (
      action: Parameters<typeof performAction>[0],
      extra?: { showQr?: boolean },
    ) => {
      setIsActing(true);
      setActionError(null);

      try {
        await performAction(action, extra);
      } catch (actionErr) {
        setActionError(
          actionErr instanceof Error ? actionErr.message : "Action impossible",
        );
      } finally {
        setIsActing(false);
      }
    },
    [performAction],
  );

  const handleLogout = useCallback(() => {
    clearHostPassword();
    router.push("/");
  }, [router]);

  const hasTriggeredResults = useRef(false);

  useEffect(() => {
    hasTriggeredResults.current = false;
  }, [session?.currentQuestionIndex, session?.phase]);

  useEffect(() => {
    if (
      session?.phase === "voting" &&
      isExpired &&
      !hasTriggeredResults.current
    ) {
      hasTriggeredResults.current = true;
      runAction("show_results");
    }
  }, [isExpired, runAction, session?.phase]);

  if (!isAuthenticated) {
    return (
      <div className="relative flex h-dvh flex-col overflow-hidden">
        <DecorativeBackground />
        <Link
          href="/"
          className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-(--gold)/40 bg-white/80 px-4 py-2 text-sm font-semibold text-(--ink) backdrop-blur-sm transition hover:bg-(--gold-light)/60"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Retour
        </Link>
        <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-6">
          <form
            onSubmit={handleAuth}
            className="wedding-card p-8"
          >
            <p className="wedding-label">Animateur</p>
            <h1 className="wedding-title mt-3 text-4xl">Espace DJ du jeu 🎤</h1>
            <input
              type="password"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
              placeholder="Mot de passe animateur"
              className="input-wedding mt-6"
            />
            {authError ? (
              <p className="mt-4 text-sm font-semibold text-rose-700">
                {authError}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="btn-primary mt-6 w-full"
            >
              {isAuthenticating ? "Connexion..." : "Accéder au tableau de bord"}
            </button>
          </form>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <main className="flex h-dvh items-center justify-center overflow-hidden">
        <p className="font-semibold text-(--ink-muted)">Chargement...</p>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="mx-auto flex h-dvh max-w-md flex-col justify-center overflow-hidden px-6">
        <p className="font-semibold text-rose-700">
          {error ?? "Session introuvable"}
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 text-sm font-semibold text-(--ink-muted) underline"
        >
          Se déconnecter
        </button>
      </main>
    );
  }

  const voteStatsLabel = `${stats.voteCount}/${stats.connectedCount} votes`;
  const showReset =
    session.phase !== "lobby" && session.phase !== "finished";

  return (
    <div className="relative flex h-dvh max-h-dvh flex-col overflow-hidden">
      {!isFullscreen ? <DecorativeBackground /> : null}

      <HostRoomHeader
        code={session.code}
        isFullscreen={isFullscreen}
        onToggleMenu={() => setAdminMenuOpen((open) => !open)}
        onToggleFullscreen={toggleFullscreen}
        onToggleQr={() => {
          setShowLocalQr(true);
          runAction("toggle_qr", { showQr: true });
        }}
      />

      <HostFloatingControls
        code={session.code}
        isFullscreen={isFullscreen}
        onToggleMenu={() => setAdminMenuOpen((open) => !open)}
        onToggleFullscreen={toggleFullscreen}
      />

      <div
        className={[
          "fixed right-3 z-50",
          isFullscreen ? "top-12" : "top-9",
        ].join(" ")}
      >
        <HostAdminMenu
          open={adminMenuOpen}
          onClose={() => setAdminMenuOpen(false)}
          onLogout={handleLogout}
          onReset={() => runAction("reset")}
          showReset={showReset}
          isActing={isActing}
        />
      </div>

      <main
        className={[
          "relative z-10 mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-hidden",
          isFullscreen
            ? "px-[clamp(1rem,3vw,2.5rem)] pt-[clamp(0.5rem,2vh,1.5rem)] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
            : "px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]",
        ].join(" ")}
      >
        {session.phase !== "lobby" && session.phase !== "finished" ? (
          <div className="mb-[clamp(0.25rem,1vh,0.5rem)] shrink-0">
            <ProgressBar
              current={session.currentQuestionIndex + 1}
              total={QUESTIONS.length}
              size="host"
              extraLabel={
                session.phase === "voting" ? voteStatsLabel : undefined
              }
            />
          </div>
        ) : null}

        {session.phase === "lobby" ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[clamp(0.5rem,2vh,1rem)] text-center">
            <div className="animate-float text-[clamp(2.5rem,6vmin,4rem)]">
              💍
            </div>
            <h1 className="wedding-title text-[clamp(2rem,5vmin,3.5rem)] italic">
              Elle ou Lui ?
            </h1>
            <p className="text-[clamp(1.125rem,2.5vmin,1.75rem)] font-bold text-(--rose-gold)">
              {COUPLE.elle} & {COUPLE.lui}
            </p>
            <p className="rounded-2xl border-2 border-dashed border-(--gold)/50 bg-white/60 px-6 py-3 text-[clamp(1rem,2vmin,1.25rem)] font-extrabold text-(--ink)">
              {stats.connectedCount} personne
              {stats.connectedCount > 1 ? "s" : ""} connectée
              {stats.connectedCount > 1 ? "s" : ""}
            </p>
            <button
              type="button"
              disabled={isActing}
              onClick={() => runAction("start")}
              className="btn-primary mt-1"
            >
              Lancer la partie 🚀
            </button>
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {session.phase === "voting" && question ? (
            <motion.div
              key={`voting-${question.id}`}
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="min-h-0 flex-1 overflow-hidden">
                <QuestionCard
                  question={question}
                  onSelect={() => undefined}
                  isSubmitting={false}
                  remainingSeconds={remainingSeconds}
                  timerProgress={progress}
                  showTimer
                  showChoices={false}
                  size="host"
                />
              </div>
              <div className="flex shrink-0 justify-center pb-1 pt-[clamp(0.25rem,1vh,0.5rem)]">
                <button
                  type="button"
                  disabled={isActing}
                  onClick={() => {
                    hasTriggeredResults.current = true;
                    runAction("show_results");
                  }}
                  className="btn-primary-compact"
                >
                  Voir les résultats →
                </button>
              </div>
            </motion.div>
          ) : null}

          {session.phase === "results" && result && question ? (
            <motion.div
              key={`results-${question.id}`}
              className="flex min-h-0 flex-1 flex-col"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <div className="min-h-0 flex-1 overflow-hidden">
                <ResultsPanel
                  questionText={question.text}
                  result={result}
                  size="host"
                />
              </div>
              <div className="flex shrink-0 justify-center pb-1 pt-[clamp(0.25rem,1vh,0.5rem)]">
                <button
                  type="button"
                  disabled={isActing}
                  onClick={() =>
                    isLastQuestion ? runAction("finish") : runAction("next")
                  }
                  className="btn-primary-compact"
                >
                  {isLastQuestion ? "Terminer 🎊" : "Question suivante →"}
                </button>
              </div>
            </motion.div>
          ) : null}

          {session.phase === "finished" ? (
            <motion.div
              key="finished"
              className="flex min-h-0 flex-1 flex-col overflow-hidden"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <GameFinishedScreen
                size="host"
                onReset={() => runAction("reset")}
                isActing={isActing}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {actionError ? (
          <p className="shrink-0 pt-1 text-center text-sm font-semibold text-rose-700">
            {actionError}
          </p>
        ) : null}
      </main>

      {showLocalQr || session.showQr ? (
        <QrOverlay
          code={session.code}
          connectedCount={stats.connectedCount}
          onClose={() => {
            setShowLocalQr(false);
            runAction("toggle_qr", { showQr: false });
          }}
        />
      ) : null}
    </div>
  );
}
