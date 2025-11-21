import LockIcon from '@/assets/icons/lock.svg';

import type { PostDetail } from '@/entities/posts/model/post-detail';

import { useAuthContext } from '@/features/auth/context/auth-context';

import { HAIR_CONCERN_OPTION } from '../../constants/hair-concern-option';
import getSkinToneValue from '../../lib/get-skin-tone-value';
import ConsultingInputResultListItem from '../consulting-input-result-list-item';
import PostDetailContentItem from '../post-detail-content-item';
import SkinColorLabel from '../skin-color-label';

import PostDetailAuthorProfile from './post-detail-author-profile';
import PostDetailImage from './post-detail-image';

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

type PostDetailConsultingContentProps = {
  postDetail: PostDetail;
};

export default function PostDetailConsultingContent({
  postDetail,
}: PostDetailConsultingContentProps) {
  const { user, isUserDesigner } = useAuthContext();

  const {
    hairConsultPostingCreateUserProfileImageUrl: authorImageUrl,
    hairConsultPostingCreateUserName: authorName,
    hairConsultPostingCreateUserRegion: authorRegion,
    hairConsultPostingCreateUserId: authorId,
    title,
    content,
    hairConcern,
    hairConcernDetail,
    treatments,
    createdAt,
    myImageList,
    aspirations,
    skinTone,
    minPaymentPrice,
    maxPaymentPrice,
  } = postDetail;

  const myImageUrls = myImageList?.map(({ imageUrl }) => imageUrl) ?? [];

  const isWriter = authorId === user.id;

  const hiddenImages = !isWriter && !isUserDesigner;
  const priceShowed = isWriter || isUserDesigner;

  const skinToneValue = getSkinToneValue(skinTone);

  const concern = hairConcern === HAIR_CONCERN_OPTION.etc.label ? hairConcernDetail : hairConcern;

  const hasAspirations =
    aspirations && (aspirations.aspirationImages.length > 0 || aspirations.aspirationDescription);

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-5 px-5">
        <PostDetailAuthorProfile
          imageUrl={authorImageUrl}
          name={authorName}
          region={authorRegion}
          createdAt={createdAt}
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
      <div className="flex flex-col gap-8 px-5">
        {hasAspirations && (
          <PostDetailContentItem label="추구미">
            {aspirations.aspirationImages.length > 0 &&
              (hiddenImages ? (
                <HiddenImageAlertBox />
              ) : (
                <ImageList images={aspirations.aspirationImages} size="small" />
              ))}
            {aspirations.aspirationDescription && (
              <p className="typo-body-2-long-regular text-label-default whitespace-pre-wrap">
                {aspirations.aspirationDescription}
              </p>
            )}
          </PostDetailContentItem>
        )}
        {treatments && treatments.length > 0 && (
          <PostDetailContentItem label="최근 받은 시술">
            {treatments.map(({ treatmentName, treatmentDate }, index) => (
              <ConsultingInputResultListItem
                key={`${treatmentName}-${treatmentDate}-${index}`}
                name={treatmentName}
                description={treatmentDate}
              />
            ))}
          </PostDetailContentItem>
        )}
        {skinToneValue && (
          <PostDetailContentItem label="피부톤" className="gap-4">
            <SkinColorLabel type={skinToneValue} />
          </PostDetailContentItem>
        )}
        {content && (
          <PostDetailContentItem label="기타의견">
            <p className="typo-body-2-long-regular text-label-sub">{content}</p>
          </PostDetailContentItem>
        )}
        {priceShowed &&
          minPaymentPrice != null &&
          maxPaymentPrice != null &&
          minPaymentPrice >= 0 &&
          maxPaymentPrice >= 0 && (
            <PostDetailContentItem label="원하는 시술 가격대">
              <p className="typo-body-2-long-regular text-label-sub">
                {minPaymentPrice.toLocaleString()}원~{maxPaymentPrice.toLocaleString()}원
              </p>
            </PostDetailContentItem>
          )}
      </div>
    </div>
  );
}
