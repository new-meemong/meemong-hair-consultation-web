import type { PostDetail } from '@/entities/posts/model/post-detail';
import { Avatar, AvatarFallback, AvatarImage, Separator } from '@/shared/ui';
import useShowImageViewerModal from '@/shared/ui/hooks/use-show-image-viewer-modal';
import Image from 'next/image';
import { LikeButton } from '@/features/likes/ui/like-button';
import CommentIcon from '@/assets/icons/comment.svg';
import ShareIcon from '@/assets/icons/share.svg';
import { useAuthContext } from '@/shared/context/auth-context';

type PostDetailItemProps = {
  postDetail: PostDetail;
};

function PostDetailItem({ postDetail }: PostDetailItemProps) {
  const { isUserDesigner } = useAuthContext();

  const {
    id,
    title,
    content,
    createdAt,
    images,
    likeCount,
    commentCount,
    isFavorited,
    hairConsultPostingCreateUserName: authorName,
    hairConsultPostingCreateUserProfileImageUrl: authorImageUrl,
    hairConsultPostingCreateUserRegion: authorRegion,
  } = postDetail;

  const showImageViewerModal = useShowImageViewerModal();

  const handleImageClick = (index: number) => {
    showImageViewerModal(images, index);
  };

  const shouldShowRegion = isUserDesigner && authorRegion;

  return (
    <>
      <div className="flex flex-col gap-5 py-6">
        <div className="flex flex-col gap-5 px-5">
          <div className="flex items-center gap-2">
            <Avatar>
              {authorImageUrl ? (
                <AvatarImage src={authorImageUrl} className="w-12 h-12 rounded-6" />
              ) : (
                <AvatarFallback>
                  <Image
                    src="/profile.svg"
                    alt="프로필"
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <p className="typo-body-1-semibold text-label-default">{authorName}</p>
              <p className="typo-body-3-regular text-label-info">
                {shouldShowRegion ? `${authorRegion} | ` : ''}
                {createdAt}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="typo-headline-bold text-label-strong">{title}</h1>
            <p className="typo-body-1-regular text-label-default">{content}</p>
          </div>
        </div>

        {/* 게시글 이미지 */}
        <div className="flex gap-2 px-5 overflow-x-auto scrollbar-hide">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative min-w-35 h-35 rounded-6 cursor-pointer overflow-hidden"
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image}
                alt={`게시글 이미지 ${index + 1}`}
                fill
                className="object-cover"
                sizes="140px"
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />
      <div className="flex items-center justify-between gap-5 py-4 px-5">
        <div className="flex flex-1 justify-center items-center gap-1">
          <LikeButton postId={id} liked={isFavorited} likeCount={likeCount} />
        </div>
        <div className="flex flex-1 justify-center items-center gap-1">
          <CommentIcon className="w-5 h-5 fill-label-placeholder" />
          <span className="typo-body-1-medium text-label-info">{commentCount}</span>
        </div>
        <div className="flex flex-1 justify-center items-center gap-1">
          <ShareIcon className="w-5 h-5 fill-label-placeholder" />
          <span className="typo-body-1-medium text-label-info">공유</span>
        </div>
      </div>
      <Separator />
    </>
  );
}

export default PostDetailItem;
