'use client';

import { Avatar, AvatarFallback, AvatarImage, Button, ROUTES } from '@/shared';
import {
  FEMALE_HAIR_LENGTH_OPTIONS,
  MALE_HAIR_LENGTH_OPTIONS,
} from '@/features/posts/constants/hair-length-options';
import { useParams, useSearchParams } from 'next/navigation';

import type { ApiError } from '@/shared/api/client';
import { BANG_STYLE_OPTIONS_NEW } from '@/features/posts/constants/bang-style';
import type { BangStyleOptionNew } from '@/features/posts/constants/bang-style';
import type { ComponentProps } from 'react';
import { FACE_TYPE_OPTIONS_NEW } from '@/features/posts/constants/face-shape';
import type { HTTPError } from 'ky';
import type { HairLengthOption } from '@/features/posts/constants/hair-length-options';
import Image from 'next/image';
import ProfileIcon from '@/assets/icons/profile.svg';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { SiteHeader } from '@/widgets/header';
import { format } from 'date-fns';
import { goDesignerProfilePage } from '@/shared/lib/go-designer-profile-page';
import hairLengthFeedbackF1 from '@/assets/hair-length-feedback/hair_length_feedback_f1.png';
import hairLengthFeedbackF2 from '@/assets/hair-length-feedback/hair_length_feedback_f2.png';
import hairLengthFeedbackF3 from '@/assets/hair-length-feedback/hair_length_feedback_f3.png';
import hairLengthFeedbackF4 from '@/assets/hair-length-feedback/hair_length_feedback_f4.png';
import hairLengthFeedbackF5 from '@/assets/hair-length-feedback/hair_length_feedback_f5.png';
import hairLengthFeedbackF6 from '@/assets/hair-length-feedback/hair_length_feedback_f6.png';
import hairLengthFeedbackM1 from '@/assets/hair-length-feedback/hair_length_feedback_m1.png';
import hairLengthFeedbackM2 from '@/assets/hair-length-feedback/hair_length_feedback_m2.png';
import hairLengthFeedbackM3 from '@/assets/hair-length-feedback/hair_length_feedback_m3.png';
import hairLengthFeedbackM4 from '@/assets/hair-length-feedback/hair_length_feedback_m4.png';
import hairLengthFeedbackM5 from '@/assets/hair-length-feedback/hair_length_feedback_m5.png';
import hairLengthFeedbackM6 from '@/assets/hair-length-feedback/hair_length_feedback_m6.png';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useEffect } from 'react';
import useGetHairConsultationAnswerDetail from '@/features/posts/api/use-get-hair-consultation-answer-detail';
import useGetHairConsultationDetail from '@/features/posts/api/use-get-hair-consultation-detail';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowMongInsufficientSheet from '@/features/mong/hook/use-show-mong-insufficient-sheet';
import useStartChat from '@/features/chat/hook/use-start-chat';

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, 'MM/dd hh:mm');
};

const isAdviceRequired = (advice: boolean | number | null | undefined) =>
  advice === true || advice === 1;

const normalizeText = (value: string) => value.replace(/\s+/g, '').toLowerCase();

const isMaleSex = (sex: string | number | null | undefined) =>
  sex === '남자' || sex === 'MALE' || sex === 'male' || sex === 1 || sex === '1';

const ALL_BANG_STYLE_OPTIONS = [...BANG_STYLE_OPTIONS_NEW.MALE, ...BANG_STYLE_OPTIONS_NEW.FEMALE];
const MALE_HAIR_LENGTH_FEEDBACK_IMAGE_MAP: Record<string, ImageSource> = {
  크롭: hairLengthFeedbackM1,
  숏: hairLengthFeedbackM2,
  미디엄: hairLengthFeedbackM3,
  미디엄롱: hairLengthFeedbackM4,
  롱: hairLengthFeedbackM5,
  장발: hairLengthFeedbackM6,
};
const FEMALE_HAIR_LENGTH_FEEDBACK_IMAGE_MAP: Record<string, ImageSource> = {
  숏컷: hairLengthFeedbackF1,
  단발: hairLengthFeedbackF2,
  중단발: hairLengthFeedbackF3,
  미디엄: hairLengthFeedbackF4,
  미디엄롱: hairLengthFeedbackF5,
  장발: hairLengthFeedbackF6,
};

const findBangStyleOption = (label: string, primaryOptions: BangStyleOptionNew[]) => {
  const normalizedLabel = normalizeText(label);

  return (
    primaryOptions.find((option) => normalizeText(option.title) === normalizedLabel) ??
    ALL_BANG_STYLE_OPTIONS.find((option) => normalizeText(option.title) === normalizedLabel)
  );
};

const findHairLengthOption = (value: string, primaryOptions: HairLengthOption[]) => {
  const normalizedValue = normalizeText(value);

  return primaryOptions.find(
    (option) =>
      normalizeText(option.value) === normalizedValue ||
      normalizeText(option.label) === normalizedValue,
  );
};

type ImageSource = ComponentProps<typeof Image>['src'];

type RecommendationPreviewItem = {
  key: string;
  label: string;
  description: string;
  imageSrc?: ImageSource;
};

const getHairLengthFeedbackImage = (value: string, isMale: boolean) => {
  const normalizedValue = normalizeText(value);
  const imageMap = isMale
    ? MALE_HAIR_LENGTH_FEEDBACK_IMAGE_MAP
    : FEMALE_HAIR_LENGTH_FEEDBACK_IMAGE_MAP;

  const matchedKey = Object.keys(imageMap).find((key) => normalizeText(key) === normalizedValue);

  return matchedKey ? imageMap[matchedKey] : undefined;
};

function StoreConsultingNotice() {
  return (
    <div className="mt-2 rounded-6 bg-alternative p-3">
      <p className="typo-body-2-regular text-label-info">매장 상담이 필요합니다.</p>
    </div>
  );
}

function RecommendationPreviewRows({ items }: { items: RecommendationPreviewItem[] }) {
  if (items.length === 0) {
    return <p className="mt-2 typo-body-2-regular text-label-sub">-</p>;
  }

  return (
    <div className="mt-2 flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-4">
          <div className="size-[162px] shrink-0 overflow-hidden rounded-6 bg-alternative">
            {item.imageSrc ? (
              <Image
                src={item.imageSrc}
                alt={item.label}
                width={162}
                height={162}
                className="size-[162px] object-cover"
              />
            ) : (
              <div className="flex size-[162px] items-center justify-center typo-body-2-regular text-label-placeholder">
                이미지 없음
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="typo-body-1-semibold text-label-default">{item.label}</p>
            <p className="mt-2 typo-body-2-regular text-label-sub break-words">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NewConsultingResponsePage() {
  const { postId, responseId } = useParams();
  const searchParams = useSearchParams();
  const { push, back } = useRouterWithUser();
  const { user, isUserModel } = useAuthContext();
  const { startChat } = useStartChat();
  const showMongInsufficientSheet = useShowMongInsufficientSheet();
  const postIdString = postId?.toString() ?? '';
  const responseIdString = responseId?.toString() ?? '';
  const postListTab = searchParams.get(SEARCH_PARAMS.POST_LIST_TAB) ?? 'latest';

  const { data: response, error } = useGetHairConsultationAnswerDetail(
    postIdString,
    responseIdString,
  );
  const { data: consultationDetailResponse } = useGetHairConsultationDetail(postIdString);

  useEffect(() => {
    if (error && 'response' in error) {
      const httpError = error as HTTPError & {
        response?: { data?: { error?: ApiError }; status?: number };
      };

      if (httpError.response?.status === 409) {
        showMongInsufficientSheet();
        back();
        return;
      }

      const apiError = httpError.response?.data?.error;
      if (
        httpError.response?.status === 400 &&
        apiError?.fieldErrors &&
        apiError.fieldErrors.length > 0
      ) {
        console.error('Validation error:', apiError.fieldErrors);
        back();
      }
    }
  }, [error, back, showMongInsufficientSheet]);

  const answer = response?.data;
  const consultationDetail = consultationDetailResponse?.data;

  if (!answer) return null;

  const postWriterId =
    consultationDetail?.user?.id ??
    consultationDetail?.hairConsultationCreateUserId ??
    consultationDetail?.hairConsultationCreateUser?.userId;
  const isResponseWriter = user.id === answer.user.id;
  const isPostWriter = postWriterId != null && user.id === postWriterId;
  const shouldShowBottomModelActions = isUserModel && !isResponseWriter;

  const handleDesignerProfileClick = () => {
    goDesignerProfilePage(answer.user.id.toString());
  };

  const handleOriginalPostClick = () => {
    push(ROUTES.POSTS_NEW_DETAIL(postIdString), {
      [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
    });
  };

  const handleChatClick = async () => {
    const finalPostId = isPostWriter ? postIdString : undefined;
    const finalAnswerId = isPostWriter ? responseIdString : undefined;

    await startChat({
      receiverId: answer.user.id,
      postId: finalPostId,
      answerId: finalAnswerId,
      entrySource: 'CONSULTING_RESPONSE',
    });
  };

  const postWriterSex = searchParams.get(SEARCH_PARAMS.POST_WRITER_SEX);
  const isMale =
    (postWriterSex ? isMaleSex(postWriterSex) : null) ??
    isMaleSex(
      consultationDetail?.user?.sex ??
        consultationDetail?.hairConsultationCreateUserSex ??
        consultationDetail?.hairConsultationCreateUser?.sex,
    );
  const faceTypeOption = FACE_TYPE_OPTIONS_NEW.find((option) => option.label === answer.faceShape);
  const bangStyleOptions = isMale ? BANG_STYLE_OPTIONS_NEW.MALE : BANG_STYLE_OPTIONS_NEW.FEMALE;
  const hairLengthOptions = isMale ? MALE_HAIR_LENGTH_OPTIONS : FEMALE_HAIR_LENGTH_OPTIONS;

  const needsFaceShapeConsulting = isAdviceRequired(answer.isFaceShapeAdvice);
  const needsBangStyleConsulting = isAdviceRequired(answer.isBangsTypeAdvice);
  const needsHairLengthConsulting = isAdviceRequired(answer.isHairLengthAdvice);
  const needsHairLayerConsulting = isAdviceRequired(answer.isHairLayerAdvice);
  const needsHairCurlConsulting = isAdviceRequired(answer.isHairCurlAdvice);

  const bangStyleItems: RecommendationPreviewItem[] = (answer.bangsTypes ?? []).map(
    (bangType, index) => {
      const option = findBangStyleOption(bangType, bangStyleOptions);

      return {
        key: `${bangType}-${index}`,
        label: option?.title ?? bangType,
        description: option?.description ?? '스타일 설명 정보가 없습니다.',
        imageSrc: option?.unselectedImage,
      };
    },
  );

  const hairLengthItems: RecommendationPreviewItem[] = (answer.hairLengths ?? []).map(
    (hairLength, index) => {
      const option = findHairLengthOption(hairLength, hairLengthOptions);

      return {
        key: `${hairLength}-${index}`,
        label: option?.label ?? hairLength,
        description: option?.description ?? '기장 설명 정보가 없습니다.',
        imageSrc: getHairLengthFeedbackImage(hairLength, isMale) ?? option?.image,
      };
    },
  );

  const hasLayerValues = !!answer.hairLayers && answer.hairLayers.length > 0;
  const shouldShowLayerSection = hasLayerValues || (!isMale && needsHairLayerConsulting);
  const hairCurlValues = answer.hairCurls ?? [];

  const priceText =
    answer.priceType === 'SINGLE'
      ? `${(answer.price ?? 0).toLocaleString()}원`
      : `${(answer.minPrice ?? 0).toLocaleString()}원 ~ ${(answer.maxPrice ?? 0).toLocaleString()}원`;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen bg-white">
      <SiteHeader title="컨설팅 답변" showBackButton />
      <div
        className="overflow-y-auto"
        style={
          shouldShowBottomModelActions
            ? { paddingBottom: 'calc(100px + env(safe-area-inset-bottom))' }
            : undefined
        }
      >
        <div className="flex w-full flex-col items-start gap-4 bg-label-default px-5 py-8">
          <Avatar className="size-12 items-center justify-center rounded-full overflow-hidden">
            {answer.user.profilePictureURL ? (
              <AvatarImage src={answer.user.profilePictureURL} className="size-12 rounded-full" />
            ) : (
              <AvatarFallback>
                <ProfileIcon className="size-12 bg-label-info" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col gap-2">
            <p className="typo-title-3-semibold text-white whitespace-pre-line">
              {`${answer.user.displayName} 디자이너가 보낸\n컨설팅 답변입니다`}
            </p>
            <p className="typo-body-2-regular text-label-placeholder">
              {`${formatDateTime(answer.createdAt)} 작성`}
            </p>
          </div>

          {!isResponseWriter && !shouldShowBottomModelActions ? (
            <div className="mt-8 flex w-full flex-col gap-3">
              <Button theme="whiteBorder" onClick={handleChatClick}>
                채팅하기
              </Button>
              <Button theme="whiteBorder" onClick={handleDesignerProfileClick}>
                디자이너 프로필 보기
              </Button>
              {isPostWriter && (
                <Button theme="whiteBorder" onClick={handleOriginalPostClick}>
                  원글 보기
                </Button>
              )}
            </div>
          ) : null}
        </div>

        <div className="px-5 pt-7">
          <p className="typo-headline-semibold text-label-default">얼굴형/헤어 분석 결과</p>

          <div className="mt-7">
            <p className="typo-body-1-semibold text-label-default">얼굴형</p>
            <p className="mt-1 typo-body-2-regular text-label-info">
              올려주신 사진을 바탕으로 얼굴형을 진단했어요.
            </p>
            {needsFaceShapeConsulting ? (
              <StoreConsultingNotice />
            ) : faceTypeOption ? (
              <div className="mt-2 flex items-center gap-4">
                <div className="size-[162px] shrink-0 overflow-hidden rounded-6 bg-label-default">
                  <Image
                    src={faceTypeOption.emptyImage}
                    alt={faceTypeOption.label}
                    width={162}
                    height={162}
                    className="size-[162px] object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <p className="typo-body-1-semibold text-label-default">{faceTypeOption.label}</p>
                  <p className="mt-2 typo-body-2-regular text-label-sub break-words">
                    {faceTypeOption.description}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 typo-body-2-regular text-label-sub">-</p>
            )}
          </div>

          <div className="mt-7">
            <p className="typo-body-1-semibold text-label-default">추천 앞머리 스타일</p>
            <p className="mt-1 typo-body-2-regular text-label-info">
              사진 속 스타일은 예시입니다. 전체 스타일이 아닌 앞머리 연출법만 확인해주세요.
            </p>
            {needsBangStyleConsulting ? (
              <StoreConsultingNotice />
            ) : (
              <RecommendationPreviewRows items={bangStyleItems} />
            )}
          </div>

          <div className="mt-7">
            <p className="typo-body-1-semibold text-label-default">추천 기장</p>
            <p className="mt-1 typo-body-2-regular text-label-info">
              사진 속 스타일은 예시입니다. 전체 스타일이 아닌 기장만 확인해주세요.
            </p>
            {needsHairLengthConsulting ? (
              <StoreConsultingNotice />
            ) : (
              <RecommendationPreviewRows items={hairLengthItems} />
            )}
          </div>

          {shouldShowLayerSection && (
            <div className="mt-7">
              <p className="typo-body-1-semibold text-label-default">추천 레이어</p>
              {needsHairLayerConsulting ? (
                <StoreConsultingNotice />
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(answer.hairLayers ?? []).map((layer, index) => (
                    <span
                      key={`${layer}-${index}`}
                      className="rounded-full bg-alternative px-4 py-2 typo-body-2-regular text-label-sub"
                    >
                      {layer}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-7">
            <p className="typo-body-1-semibold text-label-default">추천 컬</p>
            {needsHairCurlConsulting ? (
              <StoreConsultingNotice />
            ) : hairCurlValues.length === 0 ? (
              <p className="mt-2 typo-body-2-regular text-label-sub">-</p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-2">
                {hairCurlValues.map((hairCurl, index) => (
                  <span
                    key={`${hairCurl}-${index}`}
                    className="rounded-full bg-alternative px-4 py-2 typo-body-2-regular text-label-sub"
                  >
                    {hairCurl}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-7 rounded-6 bg-alternative p-2.5">
            <p className="typo-body-3-regular text-label-info">
              제공해주신 사진을 기반으로 분석된 결과입니다. 정확한 상담은 매장 방문 후 디자이너님과
              직접 상담하시는 것을 권장합니다.
            </p>
          </div>
        </div>

        <div className="mt-7 h-1.5 w-full bg-alternative" />

        <div className="px-5 pt-7 pb-7">
          <p className="typo-headline-semibold text-label-default">추천하는 시술</p>
          <p className="mt-1 typo-body-2-regular text-label-info">
            {`${answer.user.displayName} 디자이너님이 시술을 제안했어요`}
          </p>

          {answer.styleImages && answer.styleImages.length > 0 && (
            <div className="mt-7 overflow-x-auto scrollbar-hide">
              <div className="flex w-max gap-2">
                {answer.styleImages.map((imageUrl: string, index: number) => (
                  <img
                    key={`${imageUrl}-${index}`}
                    src={imageUrl}
                    alt={`treatment-style-image-${index + 1}`}
                    className="size-[140px] shrink-0 rounded-6 object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          <div className={answer.styleImages && answer.styleImages.length > 0 ? 'mt-4' : 'mt-7'}>
            <div className="flex items-start">
              <p className="w-[60px] shrink-0 text-left typo-body-1-long-semibold text-label-default">
                시술명
              </p>
              <p className="ml-6 flex-1 text-left typo-body-2-regular text-label-default">
                {answer.title || '-'}
              </p>
            </div>
            <div className="mt-1 flex items-start">
              <p className="w-[60px] shrink-0 text-left typo-body-1-long-semibold text-label-default">
                가격
              </p>
              <p className="ml-6 flex-1 text-left typo-body-2-regular text-label-default">
                {priceText}
              </p>
            </div>
            <div className="mt-4 border-b-1 border-border-default" />
            <div className="mt-4">
              <p className="typo-body-1-semibold text-label-default">종합의견</p>
              <p className="mt-1 typo-body-2-regular text-label-sub whitespace-pre-wrap">
                {answer.description || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {shouldShowBottomModelActions && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t-1 border-border-default bg-white">
          <div className="mx-auto flex min-w-[375px] w-full gap-2 px-5 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
            <Button
              theme="white"
              size="lg"
              className="flex-1 rounded-4"
              onClick={handleDesignerProfileClick}
            >
              디자이너 프로필 보기
            </Button>
            <Button size="lg" className="flex-1 rounded-4" onClick={handleChatClick}>
              추가 상담하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
