import CommentIcon from '@/assets/icons/comment.svg';
import ShareIcon from '@/assets/icons/share.svg';
import TodayConsultantBanner from '@/features/auth/ui/today-consultant-banner';
import { LikeButton } from '@/features/likes/ui/like-button';
import { Separator } from '@/shared/ui';
import ActionItem from '@/shared/ui/action-item';

import { usePostDetail } from '../../context/post-detail-context';

import PostDetailConsultingContent from './post-detail-consulting-content';
import PostDetailContent from './post-detail-content';

function PostDetailItem() {
  const { postDetail, isConsultingPost } = usePostDetail();
  const { id, likeCount, commentCount, isFavorited } = postDetail;

  return (
    <>
      {isConsultingPost ? (
        <PostDetailConsultingContent postDetail={postDetail} />
      ) : (
        <PostDetailContent postDetail={postDetail} />
      )}

      <Separator />
      <div className="flex items-center justify-between gap-5 px-5">
        <div className="flex flex-1 justify-center items-center gap-1">
          <LikeButton postId={id} liked={isFavorited} likeCount={likeCount} />
        </div>
        <ActionItem
          icon={<CommentIcon className="w-5 h-5 fill-label-placeholder" />}
          label={commentCount.toString()}
        />
        <ActionItem icon={<ShareIcon className="w-5 h-5 fill-label-placeholder" />} label="공유" />
      </div>
      <Separator />
      <div className="py-3">
        <TodayConsultantBanner />
      </div>
    </>
  );
}

export default PostDetailItem;
