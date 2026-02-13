import type { PostDetail, Treatment } from '@/entities/posts/model/post-detail';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import type { HairConsultationDetail } from '@/entities/posts/model/hair-consultation-detail';
import { MY_IMAGE_TYPE } from '@/features/posts/constants/my-image-type';
import { SKIN_TONE_OPTION_LABEL } from '@/features/posts/constants/skin-tone';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import { USER_SEX } from '@/entities/user/constants/user-sex';

type SkinToneLabel = (typeof SKIN_TONE_OPTION_LABEL)[keyof typeof SKIN_TONE_OPTION_LABEL];

const isSkinToneLabel = (value: string | null): value is SkinToneLabel => {
  if (!value) return false;
  return (Object.values(SKIN_TONE_OPTION_LABEL) as string[]).includes(value);
};

const mapMyImageType = (subType: string) => {
  switch (subType) {
    case 'CURRENT':
      return MY_IMAGE_TYPE.RECENT;
    case 'FRONT':
      return MY_IMAGE_TYPE.FRONT;
    case 'TIED_SIDE':
      return MY_IMAGE_TYPE.SIDE;
    case 'UPPER_BODY':
      return MY_IMAGE_TYPE.WHOLE_BODY;
    default:
      return MY_IMAGE_TYPE.RECENT;
  }
};

const MALE_SKIN_BRIGHTNESS_VALUES = new Set([
  '매우 밝은/하얀 피부',
  '밝은 피부',
  '보통 피부',
  '까만 피부',
  '매우 어두운/까만 피부',
]);

const FEMALE_SKIN_BRIGHTNESS_VALUES = new Set([
  '18호 이하',
  '19~21호',
  '22~23호',
  '24~25호',
  '26호 이상',
]);

const MALE_ONLY_HAIR_LENGTH_VALUES = new Set(['크롭', '숏', '장발']);
const FEMALE_ONLY_HAIR_LENGTH_VALUES = new Set(['숏컷', '단발', '중단발']);

const normalizeUserSex = (sex: string | number | null | undefined) => {
  if (sex == null) return null;

  if (sex === USER_SEX.MALE || sex === 'MALE' || sex === 'male' || sex === 1 || sex === '1') {
    return USER_SEX.MALE;
  }

  if (sex === USER_SEX.FEMALE || sex === 'FEMALE' || sex === 'female' || sex === 2 || sex === '2') {
    return USER_SEX.FEMALE;
  }

  return null;
};

const inferUserSex = (detail: HairConsultationDetail) => {
  if (detail.skinBrightness) {
    if (MALE_SKIN_BRIGHTNESS_VALUES.has(detail.skinBrightness)) {
      return USER_SEX.MALE;
    }
    if (FEMALE_SKIN_BRIGHTNESS_VALUES.has(detail.skinBrightness)) {
      return USER_SEX.FEMALE;
    }
  }

  if (detail.hairLength) {
    if (MALE_ONLY_HAIR_LENGTH_VALUES.has(detail.hairLength)) {
      return USER_SEX.MALE;
    }
    if (FEMALE_ONLY_HAIR_LENGTH_VALUES.has(detail.hairLength)) {
      return USER_SEX.FEMALE;
    }
  }

  return null;
};

const formatTreatmentYearMonth = (value: string | null) => {
  if (!value) return '';

  const normalized = value.trim();
  const match = normalized.match(/^(\d{4})[-.](\d{2})/);
  if (match) {
    return `${match[1]}.${match[2]}`;
  }

  return normalized;
};

export default function mapHairConsultationDetailToPostDetail(
  detail: HairConsultationDetail,
): PostDetail {
  const hairConcerns = detail.hairConcerns ?? [];
  const hairConcern = hairConcerns[0] ?? '';
  const hairConcernDetail = hairConcerns.length > 1 ? hairConcerns.slice(1).join(', ') : null;

  const treatments: Treatment[] | undefined =
    detail.treatments && detail.treatments.length > 0
      ? [...detail.treatments]
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((treatment) => ({
            treatmentName: treatment.treatmentType,
            treatmentDate: formatTreatmentYearMonth(treatment.treatmentDate),
            isSelf: Boolean(treatment.isSelf),
            treatmentArea: treatment.treatmentArea,
            decolorizationCount: treatment.decolorizationCount,
          }))
      : undefined;

  const creatorName =
    detail.user?.displayName ??
    detail.hairConsultationCreateUser?.name ??
    detail.hairConsultationCreateUserName ??
    '';
  const creatorProfileImageUrl =
    detail.user?.profilePictureURL ??
    detail.hairConsultationCreateUser?.profilePictureURL ??
    detail.hairConsultationCreateUserProfileImageUrl ??
    null;
  const creatorRegion = detail.user?.address ?? detail.hairConsultationCreateUserRegion ?? null;
  const creatorId = detail.user?.id ?? detail.hairConsultationCreateUserId ?? 0;
  const creatorSex =
    normalizeUserSex(
      detail.user?.sex ??
        detail.hairConsultationCreateUserSex ??
        detail.hairConsultationCreateUser?.sex,
    ) ??
    inferUserSex(detail) ??
    USER_SEX.FEMALE;

  return {
    id: detail.id,
    title: detail.title,
    content: detail.content,
    createdAt: detail.createdAt,
    images: (detail.aspirationImages ?? []).map(({ imageUrl }) => imageUrl),
    isFavorited: detail.isFavorited,
    likeCount: detail.likeCount,
    commentCount: detail.commentCount,
    viewCount: detail.viewCount,
    isPhotoVisibleToDesigner: true,
    consultType: CONSULT_TYPE.CONSULTING,
    hairConsultPostingCreateUserName: creatorName,
    hairConsultPostingCreateUserProfileImageUrl: creatorProfileImageUrl,
    hairConsultPostingCreateUserRegion: creatorRegion,
    hairConsultPostingCreateUserSex: creatorSex,
    hairConsultPostingCreateUserRole: USER_ROLE.MODEL,
    hairConsultPostingCreateUserId: creatorId,
    hairConcern,
    hairConcernDetail,
    hairLength: detail.hairLength,
    hairTexture: detail.hairTexture,
    skinBrightness: detail.skinBrightness,
    personalColor: detail.personalColor,
    treatments,
    myImageList: (detail.myImages ?? []).map(({ imageUrl, subType }) => ({
      type: mapMyImageType(subType),
      imageUrl,
    })),
    modelImageList: (detail.modelImages ?? []).map(({ imageURL }) => imageURL),
    aspirations: {
      aspirationImages: (detail.aspirationImages ?? []).map(({ imageUrl }) => imageUrl),
      aspirationDescription: detail.aspirationImageDescription,
    },
    skinTone: isSkinToneLabel(detail.skinBrightness) ? detail.skinBrightness : null,
    isAnsweredByDesigner: false,
    minPaymentPrice: detail.desiredCostPrice,
    maxPaymentPrice: detail.desiredCostPrice,
    desiredDateType: detail.desiredDateType,
    desiredDateDescription: detail.desiredDateDescription ?? detail.desiredDate,
  };
}
