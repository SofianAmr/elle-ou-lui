/** Ratio portrait commun pour les cartes elle / lui (largeur:hauteur = 3:4). */
export const CHOICE_CARD_ASPECT = "aspect-[3/4]";

/** Carte qui s'adapte à la largeur disponible (invités, résultats). */
export const choiceCardFluidClass =
  `relative ${CHOICE_CARD_ASPECT} w-full overflow-hidden rounded-3xl`;

/** Carte animateur : hauteur liée au viewport, ratio conservé. */
export const choiceCardHostClass =
  `relative ${CHOICE_CARD_ASPECT} h-[clamp(7rem,20vh,14rem)] w-auto overflow-hidden rounded-3xl`;
