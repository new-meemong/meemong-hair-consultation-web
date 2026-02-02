'use client';

import ActionItem from '@/shared/ui/action-item';
import HeartIcon from '@/assets/icons/mdi_heart.svg';
import { cn } from '@/shared/lib/utils';
import useCreateHairConsultationFavoriteMutation from '@/features/posts/api/use-create-hair-consultation-favorite-mutation';
import useDeleteHairConsultationFavoriteMutation from '@/features/posts/api/use-delete-hair-consultation-favorite-mutation';
import useExperienceGroupFavoriteMutation from '@/features/posts/api/use-experience-group-favorite-mutation';
import usePostFavoriteMutation from '@/features/posts/api/use-post-favorite-mutation';

interface LikeButtonProps {
  postId?: number;
  experienceGroupId?: number;
  liked: boolean;
  likeCount: number;
  postSource?: 'new' | 'legacy';
}

export function LikeButton({
  postId,
  experienceGroupId,
  liked,
  likeCount,
  postSource,
}: LikeButtonProps) {
  const toggleFavoriteMutation = usePostFavoriteMutation();
  const toggleExperienceGroupFavoriteMutation = useExperienceGroupFavoriteMutation();
  const createHairConsultationFavoriteMutation = useCreateHairConsultationFavoriteMutation();
  const deleteHairConsultationFavoriteMutation = useDeleteHairConsultationFavoriteMutation();

  const handleToggle = (liked: boolean) => {
    if (postId) {
      if (postSource === 'new') {
        const onSuccess = () => {};
        if (liked) {
          deleteHairConsultationFavoriteMutation.mutate(postId, { onSuccess });
        } else {
          createHairConsultationFavoriteMutation.mutate(postId, { onSuccess });
        }
      } else {
        toggleFavoriteMutation.mutate({
          hairConsultPostingId: postId,
          liked,
        });
      }
    } else if (experienceGroupId) {
      toggleExperienceGroupFavoriteMutation.mutate({
        id: experienceGroupId,
        liked,
      });
    }
  };

  const isPending =
    toggleFavoriteMutation.isPending ||
    toggleExperienceGroupFavoriteMutation.isPending ||
    createHairConsultationFavoriteMutation.isPending ||
    deleteHairConsultationFavoriteMutation.isPending;

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
      className={cn(isPending && 'cursor-not-allowed')}
      onClick={() => handleToggle(liked)}
    />
  );
}
