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

export default function mapHairConsultationDetailToPostDetail(
  detail: HairConsultationDetail,
): PostDetail {
  const hairConcern = detail.hairConcerns[0] ?? '';
  const hairConcernDetail =
    detail.hairConcerns.length > 1 ? detail.hairConcerns.slice(1).join(', ') : null;

  const treatments: Treatment[] | undefined = detail.treatment
    ? [
        {
          treatmentName: detail.treatment.treatmentType,
          treatmentDate: detail.treatment.treatmentDate ?? '',
        },
      ]
    : undefined;

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
    hairConsultPostingCreateUserName: '익명',
    hairConsultPostingCreateUserProfileImageUrl: null,
    hairConsultPostingCreateUserRegion: detail.hairConsultationCreateUserRegion,
    hairConsultPostingCreateUserSex: USER_SEX.FEMALE,
    hairConsultPostingCreateUserRole: USER_ROLE.MODEL,
    hairConsultPostingCreateUserId: detail.hairConsultationCreateUserId,
    hairConcern,
    hairConcernDetail,
    treatments,
    myImageList: (detail.myImages ?? []).map(({ imageUrl, subType }) => ({
      type: mapMyImageType(subType),
      imageUrl,
    })),
    aspirations: {
      aspirationImages: (detail.aspirationImages ?? []).map(({ imageUrl }) => imageUrl),
      aspirationDescription: detail.aspirationImageDescription,
    },
    skinTone: isSkinToneLabel(detail.skinBrightness) ? detail.skinBrightness : null,
    isAnsweredByDesigner: false,
    minPaymentPrice: detail.desiredCostPrice,
    maxPaymentPrice: detail.desiredCostPrice,
  };
}
