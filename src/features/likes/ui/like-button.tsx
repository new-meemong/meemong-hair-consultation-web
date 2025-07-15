'use client';

import { useState } from 'react';
import { usePostFavoriteMutation } from '@/features/posts/api/mutations';
import { Toggle } from '@/shared/ui/toggle';
import { cn } from '@/shared/lib/utils';
import HeartIcon from '@/assets/icons/mdi_heart.svg';

interface LikeButtonProps {
  postId?: number; // 헤어상담 게시글 ID
  initialLiked?: boolean;
  initialCount?: number;
  onToggle?: (pressed: boolean) => void;
}

export function LikeButton({
  postId,
  initialLiked = false,
  initialCount = 0,
  onToggle,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const toggleFavoriteMutation = usePostFavoriteMutation();

  const handleToggle = async (pressed: boolean) => {
    setLiked(pressed);
    setCount((prev) => (pressed ? prev + 1 : prev - 1));

    onToggle?.(pressed);

    if (postId) {
      try {
        await toggleFavoriteMutation.mutateAsync({
          hairConsultPostingId: postId,
          isLiked: !pressed, // 현재 상태의 반대를 전달
        });
      } catch (error) {
        // API 실패 시 상태 롤백
        console.error('좋아요 API 호출 실패:', error);
        setLiked(!pressed);
        setCount((prev) => (pressed ? prev - 1 : prev + 1));
      }
    }
  };

  return (
    <Toggle
      pressed={liked}
      onPressedChange={handleToggle}
      aria-label="좋아요"
      variant="outline"
      size="default"
      disabled={toggleFavoriteMutation.isPending}
      className={cn(
        'flex items-center justify-center gap-1 bg-transparent min-w-0 min-h-0 p-0 border-none',
        toggleFavoriteMutation.isPending && 'opacity-50 cursor-not-allowed',
      )}
    >
      <HeartIcon
        className={cn(
          'size-5 transition-colors duration-200',
          liked ? 'fill-negative-light' : 'fill-label-placeholder',
          'active:fill-label-disable',
        )}
      />
      <p
        className={cn(
          'typo-body-1-medium',
          liked ? 'text-negative-light' : 'text-label-info',
          'active:text-label-placeholder',
          'pt-0.5',
        )}
      >
        {toggleFavoriteMutation.isPending ? '...' : count}
      </p>
    </Toggle>
  );
}
