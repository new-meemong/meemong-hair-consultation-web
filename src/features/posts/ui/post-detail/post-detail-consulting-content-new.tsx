import {
  FEMALE_HAIR_LENGTH_OPTIONS,
  MALE_HAIR_LENGTH_OPTIONS,
} from '../../constants/hair-length-options';

import { HAIR_CONCERN_OPTION } from '../../constants/hair-concern-option';
import LockIcon from '@/assets/icons/lock.svg';
import type { PostDetail } from '@/entities/posts/model/post-detail';
import PostDetailAuthorProfile from './post-detail-author-profile';
import PostDetailImage from './post-detail-image';
import { format } from 'date-fns';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useState } from 'react';

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
    hairLength,
    hairTexture,
    skinBrightness,
    personalColor,
    createdAt,
    myImageList,
    treatments,
  } = postDetail;

  const myImageUrls = myImageList?.map(({ imageUrl }) => imageUrl) ?? [];
  const [isTreatmentsExpanded, setIsTreatmentsExpanded] = useState(false);

  const isWriter = authorId === user.id;
  const shouldShowAuthorInfo = isWriter || isUserDesigner;
  const displayName = shouldShowAuthorInfo ? authorName || '익명' : '익명';
  const displayImageUrl = shouldShowAuthorInfo ? authorImageUrl : null;
  const hiddenImages = !isWriter && !isUserDesigner;
  const concern = hairConcern === HAIR_CONCERN_OPTION.etc.label ? hairConcernDetail : hairConcern;

  const formattedCreatedAt = formatCreatedAt(createdAt);
  const hairConcernText = [hairConcern, hairConcernDetail].filter(Boolean).join(', ');
  const skinDataChips = [skinBrightness, personalColor].filter(Boolean) as string[];
  const hairLengthDescription =
    [...FEMALE_HAIR_LENGTH_OPTIONS, ...MALE_HAIR_LENGTH_OPTIONS].find(
      (option) => option.value === hairLength,
    )?.description ?? '';
  const hasTreatments = Boolean(treatments && treatments.length > 0);

  return (
    <div className="flex flex-col py-6">
      <div className="flex flex-col gap-5 px-5 mb-6">
        <PostDetailAuthorProfile
          imageUrl={displayImageUrl}
          name={displayName}
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
        <div className="mt-7 flex items-start">
          <p className="typo-body-1-semibold text-label-default shrink-0">모질</p>
          <p className="ml-3 typo-body-2-long-regular text-label-default">{hairTexture ?? '-'}</p>
        </div>
        <div className="mt-7 flex items-center">
          <p className="typo-body-1-semibold text-label-default shrink-0">피부</p>
          <div className="ml-3 flex flex-wrap gap-2">
            {skinDataChips.map((chip) => (
              <span
                key={chip}
                className="px-3 py-1 rounded-full bg-alternative typo-body-2-regular text-label-default"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-7 flex items-start">
          <p className="typo-body-1-semibold text-label-default shrink-0">기장</p>
          <div className="ml-3 flex flex-col">
            <p className="typo-body-1-medium text-label-default">{hairLength ?? '-'}</p>
            <p className="typo-body-2-long-regular text-label-default">{hairLengthDescription}</p>
          </div>
        </div>
        <div className="mt-7">
          <div className="h-px bg-border-default" />
        </div>
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <p className="typo-body-1-semibold text-label-default">시술 이력</p>
            {hasTreatments && (
              <button
                type="button"
                className="typo-body-2-medium text-label-sub"
                onClick={() => setIsTreatmentsExpanded((prev) => !prev)}
              >
                {isTreatmentsExpanded ? '접기' : '전체 보기'}
              </button>
            )}
          </div>
          {hasTreatments && (
            <div
              className={`mt-3 flex flex-col gap-2 ${
                isTreatmentsExpanded ? '' : 'max-h-[240px] overflow-hidden'
              }`}
            >
              {treatments?.map((treatment, index) => {
                const decolorizationCountLabel = String(
                  treatment.decolorizationCount ?? 0,
                ).padStart(2, '0');
                const treatmentAreaLabel = treatment.treatmentArea ?? '-';

                return (
                  <div
                    key={`${treatment.treatmentName}-${treatment.treatmentDate}-${index}`}
                    className="rounded-4 bg-alternative px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="typo-body-2-regular text-label-default">
                        {treatment.treatmentDate}
                      </p>
                      <p className="typo-body-2-semibold text-label-default">
                        {treatment.treatmentName}
                      </p>
                    </div>
                    <div className="mt-3 h-px bg-border-default" />
                    <p className="mt-3 typo-body-2-regular text-label-info">
                      탈색횟수 {decolorizationCountLabel}회 · 시술부위 - {treatmentAreaLabel}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
