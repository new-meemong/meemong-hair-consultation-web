'use client';

import HeartIcon from '@/assets/icons/mdi_heart.svg';
import { usePostFavoriteMutation } from '@/features/posts/api/use-post-favorite-mutation';
import { cn } from '@/shared/lib/utils';
import { Toggle } from '@/shared/ui/toggle';

interface LikeButtonProps {
  postId: number;
  liked: boolean;
  likeCount: number;
}

export function LikeButton({ postId, liked, likeCount }: LikeButtonProps) {
  const toggleFavoriteMutation = usePostFavoriteMutation();

  const handleToggle = (pressed: boolean) => {
    toggleFavoriteMutation.mutate({
      hairConsultPostingId: postId,
      liked: !pressed,
    });
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
        toggleFavoriteMutation.isPending && 'cursor-not-allowed',
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
        {likeCount}
      </p>
    </Toggle>
  );
}
