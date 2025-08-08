import type { PostDetail } from '@/entities/posts/model/post-detail';
import PostDetailAuthorProfile from './post-detail-author-profile';
import PostDetailImage from './post-detail-image';
import { useAuthContext } from '@/features/auth/context/auth-context';

type PostDetailContentProps = {
  postDetail: PostDetail;
};

export default function PostDetailContent({ postDetail }: PostDetailContentProps) {
  const { user } = useAuthContext();

  const {
    hairConsultPostingCreateUserProfileImageUrl: authorImageUrl,
    hairConsultPostingCreateUserId: authorId,
    hairConsultPostingCreateUserName: authorName,
    hairConsultPostingCreateUserRegion: authorRegion,
    createdAt,
    title,
    content,
    images,
    isPhotoVisibleToDesigner: shouldShowImage,
  } = postDetail;

  const isWriter = authorId === user.id;

  return (
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
            images={images}
            currentIndex={index}
            onlyShowToDesigner={shouldShowImage && !isWriter}
            size="large"
          />
        ))}
      </div>
    </div>
  );
}
