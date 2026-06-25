"use client";

import { useEffect, useState } from "react";
import type { QuestionResult } from "@/types";

export function useQuestionResult(code: string | null, questionId: number | null) {
  const requestKey = code && questionId ? `${code}:${questionId}` : null;
  const [result, setResult] = useState<QuestionResult | null>(null);
  const [resultKey, setResultKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!code || !questionId || !requestKey) {
      return;
    }

    let isMounted = true;

    async function fetchResult() {
      setIsLoading(true);
      const response = await fetch(
        `/api/session/${code}/results?questionId=${questionId}`,
      );
      const data = await response.json();

      if (!isMounted) {
        return;
      }

      if (response.ok) {
        setResult(data.result);
        setResultKey(requestKey);
      }

      setIsLoading(false);
    }

    fetchResult();
    const interval = setInterval(fetchResult, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [code, questionId, requestKey]);

  const isCurrentResult = Boolean(requestKey && resultKey === requestKey);

  return {
    result: isCurrentResult ? result : null,
    isLoading: Boolean(requestKey) && (isLoading || !isCurrentResult),
  };
}
