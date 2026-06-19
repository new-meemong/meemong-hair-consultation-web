import ActionItem from '@/shared/ui/action-item';
import CommentIcon from '@/assets/icons/comment.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import { LikeButton } from '@/features/likes/ui/like-button';
import PostDetailConsultingContentNew from './post-detail-consulting-content-new';
import PostDetailContent from './post-detail-content';
import SalonPickDetailAdSlot from '@/features/salon-pick/ui/salon-pick-detail-ad-slot';
import TopAdvisorCarousel from '@/features/auth/ui/top-advisor-carousel';
import { useOptionalAuthContext } from '@/features/auth/context/auth-context';
import DetailBannerFrame from '@/shared/ui/detail-banner-frame';
import { usePostDetail } from '../../context/post-detail-context';

function HairConsultationDetailBannerSlot({ isUserDesigner }: { isUserDesigner: boolean }) {
  if (isUserDesigner) {
    return (
      <DetailBannerFrame>
        <TopAdvisorCarousel />
      </DetailBannerFrame>
    );
  }

  return <SalonPickDetailAdSlot />;
}

function PostDetailItem({
  hideAuthorProfile,
  isWriter,
  compactTitleSpacing,
  hideDetailBannerSlot,
}: {
  hideAuthorProfile?: boolean;
  isWriter?: boolean;
  compactTitleSpacing?: boolean;
  hideDetailBannerSlot?: boolean;
}) {
  const auth = useOptionalAuthContext();
  const isUserDesigner = auth?.isUserDesigner ?? false;
  const { postDetail, isConsultingPost } = usePostDetail();
  const { id, likeCount, commentCount, isFavorited, viewCount } = postDetail;

  return (
    <>
      {isConsultingPost ? (
        <PostDetailConsultingContentNew
          postDetail={postDetail}
          hideAuthorProfile={hideAuthorProfile}
          isWriter={isWriter}
          compactTitleSpacing={compactTitleSpacing}
        />
      ) : (
        <PostDetailContent postDetail={postDetail} />
      )}

      <div className="flex items-center justify-between gap-5 px-5">
        <div className="flex flex-1 justify-center items-center gap-1">
          <LikeButton postId={id} liked={isFavorited} likeCount={likeCount} />
        </div>
        <ActionItem
          icon={<CommentIcon className="size-5 fill-label-placeholder" />}
          label={commentCount.toString()}
        />
        <ActionItem
          icon={<EyeIcon className="w-5 h-5 fill-label-placeholder" />}
          label={viewCount.toString()}
        />
      </div>
      {!hideDetailBannerSlot && (
        <HairConsultationDetailBannerSlot isUserDesigner={isUserDesigner} />
      )}
    </>
  );
}

export default PostDetailItem;
