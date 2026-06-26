"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { DecorativeBackground } from "@/components/DecorativeBackground";
import { COUPLE, type Choice } from "@/data/couple";
import type { Question } from "@/data/questions";
import { QUESTIONS } from "@/data/questions";
import { QuestionCard } from "@/components/QuestionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { GameFinishedScreen } from "@/components/GameFinishedScreen";
import { ResultsPanel } from "@/components/ResultsPanel";
import { WaitingScreen } from "@/components/WaitingScreen";
import { useGameSession } from "@/hooks/useGameSession";
import { useParticipant } from "@/hooks/useParticipant";
import { useQuestionResult } from "@/hooks/useQuestionResult";
import { useTimer } from "@/hooks/useTimer";
import { getSessionId } from "@/lib/session";
import type { GameSession } from "@/types";

type GuestGameProps = {
  code: string;
};

type GuestGameShellProps = {
  session: GameSession;
  children: React.ReactNode;
};

function GuestGameShell({ session, children }: GuestGameShellProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <DecorativeBackground />
      <main className="relative z-10 mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col px-6 py-10">
        <div className="mb-6 shrink-0">
          <ProgressBar
            current={session.currentQuestionIndex + 1}
            total={QUESTIONS.length}
          />
        </div>
        <div className="flex flex-1 flex-col justify-center">{children}</div>
      </main>
    </div>
  );
}

type GuestVotingScreenProps = {
  code: string;
  session: GameSession;
  question: Question;
  isInteractive?: boolean;
};

function GuestVotingScreen({
  code,
  session,
  question,
  isInteractive = true,
}: GuestVotingScreenProps) {
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { remainingSeconds, progress, isExpired } = useTimer(session.votingStartedAt);

  const handleSelect = useCallback(
    async (choice: Choice) => {
      if (!isInteractive || isExpired || choice === selectedChoice) {
        return;
      }

      const previousChoice = selectedChoice;
      const hadVoted = hasVoted;

      setSelectedChoice(choice);
      setHasVoted(true);
      setSubmitError(null);

      try {
        const response = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gameSessionCode: code,
            questionId: question.id,
            choice,
            sessionId: getSessionId(),
          }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Impossible d'enregistrer le vote");
        }
      } catch (voteError) {
        setSelectedChoice(previousChoice);
        setHasVoted(hadVoted);
        setSubmitError(
          voteError instanceof Error
            ? voteError.message
            : "Une erreur est survenue",
        );
      }
    },
    [code, hasVoted, isExpired, isInteractive, question.id, selectedChoice],
  );

  return (
    <GuestGameShell session={session}>
      <QuestionCard
        question={question}
        onSelect={handleSelect}
        isSubmitting={false}
        selectedChoice={selectedChoice}
        isExpired={isExpired || !isInteractive}
        remainingSeconds={remainingSeconds}
        timerProgress={progress}
        showTimer
      />
      {isExpired && !hasVoted ? (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-stone-300 bg-white/70 px-4 py-3 text-center font-semibold text-(--ink-muted)">
          Temps écoulé ⏰
        </p>
      ) : null}
      {submitError ? (
        <p className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-700">
          {submitError}
        </p>
      ) : null}
    </GuestGameShell>
  );
}

export function GuestGame({ code }: GuestGameProps) {
  const router = useRouter();
  const { session, isLoading, error } = useGameSession(code);
  useParticipant(code);

  const question = session ? QUESTIONS[session.currentQuestionIndex] : null;
  const shouldLoadResults = session?.phase === "results";
  const { result } = useQuestionResult(
    code,
    shouldLoadResults ? (question?.id ?? null) : null,
  );

  if (isLoading) {
    return (
      <div className="relative flex min-h-full flex-1 flex-col">
        <DecorativeBackground />
        <WaitingScreen
          title="Connexion..."
          subtitle="Chargement de la salle de jeu."
          showConnected={false}
        />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="relative flex min-h-full flex-1 flex-col items-center justify-center px-6 text-center">
        <DecorativeBackground />
        <p className="relative z-10 text-lg font-semibold text-rose-700">
          {error ?? "Salle introuvable"}
        </p>
        <button
          type="button"
          onClick={() => router.push("/join")}
          className="btn-primary relative z-10 mt-6"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (session.phase === "lobby") {
    return (
      <div className="relative flex min-h-full flex-1 flex-col">
        <DecorativeBackground />
        <WaitingScreen
          title="Bienvenue !"
          subtitle="Patience… L'animateur finit sûrement de répéter son discours. Regarde le projecteur et prépare-toi à deviner elle ou lui !"
        />
      </div>
    );
  }

  if (session.phase === "finished") {
    return (
      <div className="relative flex min-h-full flex-1 flex-col">
        <DecorativeBackground />
        <main className="relative z-10 mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col px-6 py-10">
          <GameFinishedScreen />
        </main>
      </div>
    );
  }

  if (session.phase === "results" && result && question) {
    return (
      <GuestGameShell session={session}>
        <ResultsPanel
          questionId={question.id}
          questionText={question.text}
          result={result}
        />
        <p className="mt-8 text-center font-semibold text-(--ink-muted)">
          Prochaine question bientôt...
        </p>
      </GuestGameShell>
    );
  }

  if (
    (session.phase === "voting" || session.phase === "results") &&
    question
  ) {
    return (
      <GuestVotingScreen
        key={session.currentQuestionIndex}
        code={code}
        session={session}
        question={question}
        isInteractive={session.phase === "voting"}
      />
    );
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <DecorativeBackground />
      <WaitingScreen
        title={`${COUPLE.elle} & ${COUPLE.lui}`}
        subtitle="Patience..."
      />
    </div>
  );
}
