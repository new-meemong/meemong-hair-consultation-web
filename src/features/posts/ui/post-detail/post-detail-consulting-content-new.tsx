import {
  FEMALE_HAIR_LENGTH_OPTIONS,
  MALE_HAIR_LENGTH_OPTIONS,
} from '../../constants/hair-length-options';
import { useMemo, useState } from 'react';

import { HAIR_CONCERN_OPTION } from '../../constants/hair-concern-option';
import LockIcon from '@/assets/icons/lock.svg';
import type { PostDetail } from '@/entities/posts/model/post-detail';
import PostDetailAuthorProfile from './post-detail-author-profile';
import PostDetailImage from './post-detail-image';
import { format } from 'date-fns';
import { isUserMale } from '@/entities/user/lib/user-sex';
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

const PERSONAL_COLOR_BASE_COLOR_MAP: Record<string, string> = {
  봄웜: '#FAC4A8',
  여름쿨: '#F1D0E3',
  가을웜: '#EBB295',
  겨울쿨: '#E6447A',
};

const formatPersonalColorDetailLabel = (value: string) => value.replace(/^(봄|여름|가을|겨울)/, '');

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
    hairConsultPostingCreateUserSex: authorSex,
    title,
    hairConcern,
    hairConcernDetail,
    hairLength,
    hairTexture,
    skinBrightness,
    personalColor,
    maxPaymentPrice,
    desiredDateType,
    desiredDateDescription,
    createdAt,
    myImageList,
    modelImageList,
    treatments,
    aspirations,
  } = postDetail;

  const myImageUrls = myImageList?.map(({ imageUrl }) => imageUrl) ?? [];
  const profileImageUrls = modelImageList ?? [];
  const aspirationImageUrls = aspirations?.aspirationImages ?? [];
  const aspirationDescription = aspirations?.aspirationDescription?.trim() ?? '';
  const [isTreatmentsExpanded, setIsTreatmentsExpanded] = useState(false);

  const isWriter = authorId === user.id;
  const shouldShowAuthorInfo = isWriter || isUserDesigner;
  const displayName = shouldShowAuthorInfo ? authorName || '익명' : '익명';
  const displayImageUrl = shouldShowAuthorInfo ? authorImageUrl : null;
  const hiddenImages = !isWriter && !isUserDesigner;
  const concern = hairConcern === HAIR_CONCERN_OPTION.etc.label ? hairConcernDetail : hairConcern;

  const formattedCreatedAt = formatCreatedAt(createdAt);
  const hairConcernText = [hairConcern, hairConcernDetail].filter(Boolean).join(', ');
  const hairLengthOptions = isUserMale(authorSex)
    ? MALE_HAIR_LENGTH_OPTIONS
    : FEMALE_HAIR_LENGTH_OPTIONS;
  const hairLengthDescription =
    hairLengthOptions.find((option) => option.value === hairLength)?.description ?? '';
  const hasTreatments = Boolean(treatments && treatments.length > 0);
  const hasAspirationImages = aspirationImageUrls.length > 0;
  const payableCostText = maxPaymentPrice != null ? `${maxPaymentPrice.toLocaleString()}원` : '-';
  const desiredDateText =
    desiredDateType === '원하는 날짜 있음'
      ? (desiredDateDescription ?? '').trim() || desiredDateType
      : (desiredDateType ?? '-');
  const personalColorChip = useMemo(() => {
    if (!personalColor || personalColor === '잘모름') return null;

    const [tone = '', detail = ''] = personalColor.split(',').map((value) => value.trim());
    if (!tone) return null;

    const isUnknownDetail = !detail || detail === '상세분류모름';

    const normalizedDetail = formatPersonalColorDetailLabel(detail);

    return {
      text: isUnknownDetail ? tone : `${tone} ${normalizedDetail}`,
      backgroundColor: PERSONAL_COLOR_BASE_COLOR_MAP[tone],
    };
  }, [personalColor]);

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
        <div>
          <p className="typo-body-1-semibold text-label-default">참고 사진</p>
          <p className="mt-1 typo-body-2-long-regular text-label-info">
            첫번째 사진은 최근 7일 내 사진입니다
          </p>
          <div className="mt-3">
            {hiddenImages ? (
              <HiddenImageAlertBox />
            ) : (
              <ImageList images={myImageUrls} size="large" />
            )}
          </div>
          {isUserDesigner && (
            <div className="mt-5">
              <p className="typo-body-1-semibold text-label-default">프로필사진</p>
              <div className="mt-3">
                {hiddenImages ? (
                  <HiddenImageAlertBox />
                ) : (
                  <ImageList images={profileImageUrls} size="large" />
                )}
              </div>
            </div>
          )}
        </div>
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
            {skinBrightness && (
              <span
                key="skin-brightness"
                className="px-3 py-1 rounded-full bg-alternative typo-body-2-regular text-label-default"
              >
                {skinBrightness}
              </span>
            )}
            {personalColorChip && (
              <span
                key="personal-color"
                style={
                  personalColorChip.backgroundColor
                    ? { backgroundColor: personalColorChip.backgroundColor }
                    : undefined
                }
                className={`px-3 py-1 rounded-full bg-alternative ${
                  personalColorChip.backgroundColor
                    ? 'text-white typo-body-2-semibold'
                    : 'text-label-default typo-body-2-regular'
                }`}
              >
                {personalColorChip.text}
              </span>
            )}
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
                const hasTreatmentArea = !!treatment.treatmentArea;
                const hasDecolorizationCount =
                  treatment.decolorizationCount !== null &&
                  treatment.decolorizationCount !== undefined;
                const treatmentDetailText = (() => {
                  if (hasTreatmentArea && hasDecolorizationCount) {
                    return `탈색횟수 ${treatment.decolorizationCount}회 · 시술부위 - ${treatment.treatmentArea}`;
                  }

                  if (hasTreatmentArea) {
                    return `시술부위 - ${treatment.treatmentArea}`;
                  }

                  if (hasDecolorizationCount) {
                    return `탈색횟수 ${treatment.decolorizationCount}회`;
                  }

                  return null;
                })();

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
                    {treatmentDetailText && (
                      <>
                        <div className="mt-3 h-px bg-border-default" />
                        <p className="mt-3 typo-body-2-regular text-label-info">
                          {treatmentDetailText}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="mt-7">
          <div className="h-px bg-border-default" />
        </div>
        <div className="mt-7">
          <p className="typo-body-1-semibold text-label-default">원하는 이미지</p>
          {hiddenImages ? (
            <div className="mt-3">
              <HiddenImageAlertBox />
            </div>
          ) : (
            hasAspirationImages && (
              <div className="mt-3">
                <ImageList images={aspirationImageUrls} size="small" />
              </div>
            )
          )}
          {aspirationDescription && (
            <p className="mt-3 typo-body-1-long-regular text-label-default whitespace-pre-wrap">
              {aspirationDescription}
            </p>
          )}
          <div className="mt-7 -mx-5 h-1.5 bg-alternative" />
          <div className="mt-7">
            <p className="typo-headline-semibold text-label-default">시술관련 정보</p>
            <div className="mt-7 flex items-center justify-between gap-3">
              <p className="typo-body-1-semibold text-label-default">지불 가능한 시술비용</p>
              <p className="typo-body-2-long-regular text-label-default">{payableCostText}</p>
            </div>
            <div className="mt-7 flex items-center justify-between gap-3">
              <p className="typo-body-1-semibold text-label-default">희망 시술일</p>
              <p className="typo-body-2-long-regular text-label-default">{desiredDateText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
