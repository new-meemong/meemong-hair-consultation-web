"use client";

import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import HeartIcon from "@/assets/icons/mdi_heart.svg";

interface LikeButtonProps {
  initialLiked?: boolean;
  initialCount?: number;
  onToggle?: (pressed: boolean) => void;
}

export function LikeButton({
  initialLiked = false,
  initialCount = 0,
  onToggle,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const handleToggle = (pressed: boolean) => {
    setLiked(pressed);
    setCount((prev) => (pressed ? prev + 1 : prev - 1));
    console.log(pressed);
    onToggle?.(pressed);
  };

  return (
    <Toggle
      pressed={liked}
      onPressedChange={handleToggle}
      aria-label="좋아요"
      variant="outline"
      size="default"
      className={cn(
        "flex items-center justify-center gap-1 bg-transparent min-w-0 min-h-0 rounded-full p-0 border-none"
      )}
    >
      <HeartIcon
        className={cn(
          "size-5 transition-colors duration-200",
          liked ? "text-negative-light" : "text-label-placeholder",
          "active:text-label-disable"
        )}
      />
      <p
        className={cn(
          "typo-body-1-medium",
          liked ? "text-negative-light" : "text-label-info",
          "active:text-label-placeholder"
        )}
      >
        {count}
      </p>
    </Toggle>
  );
}
