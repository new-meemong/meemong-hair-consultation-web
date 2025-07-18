'use client';

import HeartIcon from '@/assets/icons/mdi_heart.svg';
import usePostFavoriteMutation from '@/features/posts/api/use-post-favorite-mutation';
import { cn } from '@/shared/lib/utils';
import ActionItem from '@/shared/ui/action-item';

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
    <ActionItem
      icon={
        <HeartIcon
          className={cn(
            'size-5 transition-colors duration-200',
            liked ? 'fill-negative-light' : 'fill-label-placeholder',
            'active:fill-label-disable',
          )}
        />
      }
      label={likeCount.toString()}
      labelClassName={cn(
        'typo-body-1-medium',
        liked ? 'text-negative-light' : 'text-label-info',
        'active:text-label-placeholder',
        'pt-0.5',
      )}
      className={cn(toggleFavoriteMutation.isPending && 'cursor-not-allowed')}
      onClick={() => handleToggle(liked)}
    />
  );
}
