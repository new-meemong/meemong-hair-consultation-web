import CommentIcon from '@/assets/icons/comment.svg';
import ShareIcon from '@/assets/icons/share.svg';
import type { PostDetail } from '@/entities/posts/model/post-detail';
import TodayConsultantBanner from '@/features/auth/ui/today-consultant-banner';
import { LikeButton } from '@/features/likes/ui/like-button';
import { useAuthContext } from '@/shared/context/auth-context';
import { Separator } from '@/shared/ui';
import ActionItem from '@/shared/ui/action-item';
import useShowImageViewerModal from '@/shared/ui/hooks/use-show-image-viewer-modal';
import PostDetailAuthorProfile from './post-detail-author-profile';
import PostDetailImage from './post-detail-image';

type PostDetailItemProps = {
  postDetail: PostDetail;
};

function PostDetailItem({ postDetail }: PostDetailItemProps) {
  const { user } = useAuthContext();

  const {
    id,
    title,
    content,
    createdAt,
    images,
    likeCount,
    commentCount,
    isFavorited,
    isPhotoVisibleToDesigner: shouldShowImage,
    hairConsultPostingCreateUserId: authorId,
    hairConsultPostingCreateUserName: authorName,
    hairConsultPostingCreateUserProfileImageUrl: authorImageUrl,
    hairConsultPostingCreateUserRegion: authorRegion,
  } = postDetail;

  const isWriter = authorId === user.id;

  const showImageViewerModal = useShowImageViewerModal();

  const handleImageClick = (index: number) => {
    showImageViewerModal(images, index);
  };

  return (
    <>
      <div className="flex flex-col gap-5 py-6">
        <div className="flex flex-col gap-5 px-5">
          <PostDetailAuthorProfile
            imageUrl={authorImageUrl}
            name={authorName}
            region={authorRegion}
            createdAt={createdAt}
          />
          <div className="flex flex-col gap-3">
            <h1 className="typo-headline-bold text-label-strong">{title}</h1>
            <p className="typo-body-1-regular text-label-default">{content}</p>
          </div>
        </div>

        {/* 게시글 이미지 */}
        <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide">
          {images.map((image, index) => (
            <PostDetailImage
              key={`${index}-${image}`}
              image={image}
              onClick={() => handleImageClick(index)}
              onlyShowToDesigner={shouldShowImage && !isWriter}
            />
          ))}
        </div>
      </div>

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
