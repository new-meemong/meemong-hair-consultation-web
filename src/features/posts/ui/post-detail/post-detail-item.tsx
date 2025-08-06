import CommentIcon from '@/assets/icons/comment.svg';
import ShareIcon from '@/assets/icons/share.svg';
import type { PostDetail } from '@/entities/posts/model/post-detail';
import TodayConsultantBanner from '@/features/auth/ui/today-consultant-banner';
import { LikeButton } from '@/features/likes/ui/like-button';
import { Separator } from '@/shared/ui';
import ActionItem from '@/shared/ui/action-item';
import PostDetailContent from './post-detail-content';
import PostDetailConsultingContent from './post-detail-consulting-content';

type PostDetailItemProps = {
  postDetail: PostDetail;
};

function PostDetailItem({ postDetail }: PostDetailItemProps) {
  const { id, likeCount, commentCount, isFavorited } = postDetail;

  // TODO: 컨설팅 게시글 여부 확인
  const isConsultingPost = false;

  return (
    <>
      {isConsultingPost ? (
        <PostDetailConsultingContent />
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
