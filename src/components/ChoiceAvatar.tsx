"use client";

import Image from "next/image";
import { useState } from "react";
import type { Choice } from "@/data/couple";
import {
  getChoiceFallbackImageSrc,
  getChoiceImageSrc,
} from "@/data/choice-images";

const SIZE_CLASSES = {
  sm: "h-16 w-16 rounded-2xl",
  md: "h-24 w-24 rounded-2xl",
  lg: "h-32 w-32 rounded-3xl",
  host: "h-[clamp(5rem,14vmin,9rem)] w-[clamp(5rem,14vmin,9rem)] rounded-3xl",
} as const;

type ChoiceAvatarProps = {
  choice: Choice;
  questionId: number;
  size?: keyof typeof SIZE_CLASSES;
  variant?: "fixed" | "cover";
  showImage?: boolean;
  priority?: boolean;
  objectFit?: "cover" | "contain";
  className?: string;
};

export function ChoiceAvatar({
  choice,
  questionId,
  size = "md",
  variant = "fixed",
  showImage = true,
  priority,
  objectFit = "cover",
  className = "",
}: ChoiceAvatarProps) {
  const [imageSrc, setImageSrc] = useState(() =>
    getChoiceImageSrc(choice, questionId),
  );
  const [hasImage, setHasImage] = useState(true);

  const handleError = () => {
    const fallbackSrc = getChoiceFallbackImageSrc(choice);

    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      return;
    }

    setHasImage(false);
  };

  const isCover = variant === "cover";
  const shouldPrioritize = priority ?? (isCover && showImage);

  return (
    <span
      className={[
        "overflow-hidden bg-stone-200/80",
        isCover
          ? "absolute inset-0"
          : ["relative shrink-0", SIZE_CLASSES[size]].join(" "),
        className,
      ].join(" ")}
      aria-hidden
    >
      {showImage && hasImage ? (
        <Image
          key={imageSrc}
          src={imageSrc}
          alt=""
          fill
          priority={shouldPrioritize}
          className={objectFit === "contain" ? "object-contain" : "object-cover"}
          sizes={
            isCover
              ? "(max-width: 768px) 50vw, 400px"
              : "(max-width: 768px) 128px, 200px"
          }
          onError={handleError}
        />
      ) : null}
    </span>
  );
}
