import type { Choice } from "@/data/couple";

/**
 * Images de choix par question.
 *
 * Déposez vos fichiers ici :
 *   public/images/questions/{id}/elle.{format}
 *   public/images/questions/{id}/lui.{format}
 *
 * Fallback global (optionnel) :
 *   public/images/couple/elle.{format}
 *   public/images/couple/lui.{format}
 *
 * Changez CHOICE_IMAGE_FORMAT si vos images sont en png ou jpg.
 */
export const CHOICE_IMAGE_FORMAT = "png";

export function getChoiceImageSrc(choice: Choice, questionId: number): string {
  return `/images/questions/${questionId}/${choice}.${CHOICE_IMAGE_FORMAT}`;
}

export function getChoiceFallbackImageSrc(choice: Choice): string {
  return `/images/couple/${choice}.${CHOICE_IMAGE_FORMAT}`;
}
