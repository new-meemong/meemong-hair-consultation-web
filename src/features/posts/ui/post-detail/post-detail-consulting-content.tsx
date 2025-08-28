import type { ReactNode } from 'react';

import type { PostDetail } from '@/entities/posts/model/post-detail';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { cn } from '@/lib/utils';

import { HAIR_CONCERN_OPTION } from '../../constants/hair-concern-option';
import getSkinToneValue from '../../lib/get-skin-tone-value';
import ConsultingInputResultListItem from '../consulting-input-result-list-item';
import SkinColorLabel from '../skin-color-label';

import PostDetailAuthorProfile from './post-detail-author-profile';
import PostDetailImage from './post-detail-image';

function Separator() {
  return <div className="bg-alternative h-1.5" />;
}

function ContentItem({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <p className="typo-body-1-semibold text-label-default">{label}</p>
      {children}
    </div>
  );
}

function ImageList({
  images,
  onlyShowToDesigner,
}: {
  images: string[];
  onlyShowToDesigner: boolean;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {images.map((image, index) => (
        <PostDetailImage
          key={`${index}-${image}`}
          images={images}
          currentIndex={index}
          onlyShowToDesigner={onlyShowToDesigner}
          size="small"
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
    myImages,
    aspirations,
    skinTone,
  } = postDetail;

  const myImageUrls = myImages
    ? [
        myImages.frontLooseImageUrl,
        myImages.frontTiedImageUrl,
        myImages.sideTiedImageUrl,
        myImages.upperBodyImageUrl,
      ]
    : null;

  const isWriter = authorId === user.id;
  const onlyShowToDesigner = !isWriter || isUserDesigner;

  const skinToneValue = getSkinToneValue(skinTone);

  const concern = hairConcern === HAIR_CONCERN_OPTION.etc.label ? hairConcernDetail : hairConcern;

  const hasAspirations =
    aspirations && (aspirations.aspirationImages.length > 0 || aspirations.description);

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-5 px-5">
        <PostDetailAuthorProfile
          imageUrl={authorImageUrl}
          name={authorName}
          region={authorRegion}
          createdAt={createdAt}
        />
        <p className="typo-title-3-semibold text-label-default">{title}</p>
        {concern && (
          <ContentItem label="헤어 고민">
            <p className="typo-body-2-long-regular text-label-info">{concern}</p>
          </ContentItem>
        )}
        {myImageUrls && (
          <ContentItem label="최근 내 사진">
            <ImageList images={myImageUrls} onlyShowToDesigner={onlyShowToDesigner} />
          </ContentItem>
        )}
      </div>
      <Separator />
      <div className="flex flex-col gap-8 px-5">
        {treatments && treatments.length > 0 && (
          <ContentItem label="최근 받은 시술">
            {treatments.map(({ treatmentName, treatmentDate }, index) => (
              <ConsultingInputResultListItem
                key={`${treatmentName}-${treatmentDate}-${index}`}
                name={treatmentName}
                description={treatmentDate}
              />
            ))}
          </ContentItem>
        )}
        {hasAspirations && (
          <ContentItem label="원하는 스타일">
            {aspirations.aspirationImages.length > 0 && (
              <ImageList
                images={aspirations.aspirationImages}
                onlyShowToDesigner={onlyShowToDesigner}
              />
            )}
            {aspirations.description && (
              <p className="typo-body-2-long-regular text-label-info">{aspirations.description}</p>
            )}
          </ContentItem>
        )}
        {skinToneValue && (
          <ContentItem label="피부톤" className="flex flex-row items-center justify-between">
            <SkinColorLabel type={skinToneValue} />
          </ContentItem>
        )}
        {content && (
          <ContentItem label="코멘트">
            <p className="typo-body-2-long-regular text-label-info">{content}</p>
          </ContentItem>
        )}
      </div>
    </div>
  );
}
