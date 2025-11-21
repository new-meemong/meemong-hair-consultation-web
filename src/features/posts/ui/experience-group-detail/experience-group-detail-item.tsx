import CommentIcon from '@/assets/icons/comment.svg';
import EyeIcon from '@/assets/icons/eye.svg';

import type { ExperienceGroupDetail } from '@/entities/posts/model/experience-group-detail';

import TopAdvisorCarousel from '@/features/auth/ui/top-advisor-carousel';
import { LikeButton } from '@/features/likes/ui/like-button';

import ActionItem from '@/shared/ui/action-item';

import ExperienceGroupDetailContent from './experience-group-detail-content';

type ExperienceGroupDetailItemProps = {
  experienceGroupDetail: ExperienceGroupDetail;
};

export default function ExperienceGroupDetailItem({
  experienceGroupDetail,
}: ExperienceGroupDetailItemProps) {
  const { id, isLiked, likeCount, commentCount, viewCount } = experienceGroupDetail;

  return (
    <>
      <ExperienceGroupDetailContent experienceGroupDetail={experienceGroupDetail} />
      <div className="flex items-center justify-between gap-5 px-5">
        <div className="flex flex-1 justify-center items-center gap-1">
          <LikeButton experienceGroupId={id} liked={isLiked} likeCount={likeCount} />
          <ActionItem
            icon={<CommentIcon className="size-5 fill-label-placeholder" />}
            label={commentCount.toString()}
          />
          <ActionItem
            icon={<EyeIcon className="w-5 h-5 fill-label-placeholder" />}
            label={viewCount.toString()}
          />
        </div>
      </div>
      <div className="w-full h-1.5 bg-alternative" />
      <div className="py-3">
        <TopAdvisorCarousel />
      </div>
    </>
  );
}
