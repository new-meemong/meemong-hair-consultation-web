import { HAIR_CONCERN_OPTION } from '../../constants/hair-concern-option';
import LockIcon from '@/assets/icons/lock.svg';
import type { PostDetail } from '@/entities/posts/model/post-detail';
import PostDetailAuthorProfile from './post-detail-author-profile';
import PostDetailImage from './post-detail-image';
import { format } from 'date-fns';
import { useAuthContext } from '@/features/auth/context/auth-context';

function Separator() {
  return <div className="bg-alternative h-1.5" />;
}

function HiddenImageAlertBox() {
  return (
    <div className="bg-alternative rounded-4 px-4 py-3 flex gap-2 items-center">
      <LockIcon className="size-4 fill-label-placeholder" />
      <p className="typo-body-2-regular text-label-info">이미지는 디자이너에게만 공개됩니다</p>
    </div>
  );
}

function ImageList({ images, size }: { images: string[]; size: 'small' | 'large' }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {images.map((image, index) => (
        <PostDetailImage
          key={`${index}-${image}`}
          images={images}
          currentIndex={index}
          size={size}
        />
      ))}
    </div>
  );
}

type PostDetailConsultingContentNewProps = {
  postDetail: PostDetail;
};

const formatCreatedAt = (value: string) => {
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;
  return format(parsedDate, 'MM/dd HH:mm');
};

export default function PostDetailConsultingContentNew({
  postDetail,
}: PostDetailConsultingContentNewProps) {
  const { user, isUserDesigner } = useAuthContext();

  const {
    hairConsultPostingCreateUserProfileImageUrl: authorImageUrl,
    hairConsultPostingCreateUserName: authorName,
    hairConsultPostingCreateUserRegion: authorRegion,
    hairConsultPostingCreateUserId: authorId,
    title,
    hairConcern,
    hairConcernDetail,
    createdAt,
    myImageList,
  } = postDetail;

  const myImageUrls = myImageList?.map(({ imageUrl }) => imageUrl) ?? [];

  const isWriter = authorId === user.id;

  const hiddenImages = !isWriter && !isUserDesigner;
  const concern = hairConcern === HAIR_CONCERN_OPTION.etc.label ? hairConcernDetail : hairConcern;

  const formattedCreatedAt = formatCreatedAt(createdAt);
  const hairConcernText = [hairConcern, hairConcernDetail].filter(Boolean).join(', ');

  return (
    <div className="flex flex-col py-6">
      <div className="flex flex-col gap-5 px-5 mb-6">
        <PostDetailAuthorProfile
          imageUrl={authorImageUrl}
          name={authorName}
          region={authorRegion}
          createdAt={formattedCreatedAt}
          authorId={authorId}
        />
        <div className="flex flex-col gap-3">
          <p className="typo-title-3-semibold text-label-default">{title}</p>
          {concern && <p className="typo-body-1-long-regular text-label-default">{concern}</p>}
        </div>
        {myImageUrls &&
          (hiddenImages ? (
            <HiddenImageAlertBox />
          ) : (
            <ImageList images={myImageUrls} size="large" />
          ))}
      </div>
      <Separator />
      <div className="flex flex-col px-5 mt-7">
        <p className="typo-headline-semibold text-label-default">현재 머리 상태</p>
        <div className="mt-7 flex flex-col gap-2">
          <p className="typo-body-1-semibold text-label-default">헤어 고민</p>
          <p className="typo-body-2-long-regular text-label-default">{hairConcernText}</p>
        </div>
      </div>
    </div>
  );
}
