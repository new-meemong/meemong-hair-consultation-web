"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  className?: string;
  initialLiked?: boolean;
  onToggle?: (pressed: boolean) => void;
}

export function LikeButton({
  className,
  initialLiked = false,
  onToggle,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);

  const handleToggle = (pressed: boolean) => {
    setLiked(pressed);
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
        "bg-white rounded-full p-0 h-9 w-9 border-none",
        liked && "text-negative-light data-[state=on]:text-negative-light",
        className
      )}
    >
      <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
    </Toggle>
  );
}
