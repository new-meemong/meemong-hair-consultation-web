import CommentIcon from '@/assets/icons/comment.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import TopAdvisorCarousel from '@/features/auth/ui/top-advisor-carousel';
import { LikeButton } from '@/features/likes/ui/like-button';
import ActionItem from '@/shared/ui/action-item';


import PostDetailConsultingContent from './post-detail-consulting-content';
import PostDetailContent from './post-detail-content';
import { usePostDetail } from '../../context/post-detail-context';

function PostDetailItem() {
  const { postDetail, isConsultingPost } = usePostDetail();
  const { id, likeCount, commentCount, isFavorited, viewCount } = postDetail;

  return (
    <>
      {isConsultingPost ? (
        <PostDetailConsultingContent postDetail={postDetail} />
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
      <div className="w-full h-1.5 bg-alternative" />
      <div className="py-3">
        <TopAdvisorCarousel />
      </div>
    </>
  );
}

export default PostDetailItem;
