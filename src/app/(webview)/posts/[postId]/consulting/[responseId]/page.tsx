'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  MeemongBottomActionBar,
  MeemongButton,
  MeemongCallout,
  MeemongChip,
  MeemongContentsTitle,
  MeemongDivider,
  MeemongTopBar,
} from '@/shared';
import {
  BANG_STYLE,
  BANG_STYLE_LABEL,
  BANG_STYLE_OPTIONS_NEW,
} from '@/features/posts/constants/bang-style';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';
import { FACE_SHAPE, FACE_TYPE_OPTIONS_NEW } from '@/features/posts/constants/face-shape';
import {
  FEMALE_HAIR_LENGTH_OPTIONS,
  MALE_HAIR_LENGTH_OPTIONS,
} from '@/features/posts/constants/hair-length-options';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

import type { ApiError } from '@/shared/api/client';
import type { BangStyleOptionNew } from '@/features/posts/constants/bang-style';
import type { ComponentProps } from 'react';
import type { HTTPError } from 'ky';
import type { HairConsultationDetail } from '@/entities/posts/model/hair-consultation-detail';
import type { HairLengthOption } from '@/features/posts/constants/hair-length-options';
import Image from 'next/image';
import { MEEMONG_PASS_CREATE_TYPES } from '@/features/ad-block/lib/meemong-pass-policy';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import faceTypeFeedback1 from '@/assets/face-type-feedback/face_type_feedback1.png';
import faceTypeFeedback2 from '@/assets/face-type-feedback/face_type_feedback2.png';
import faceTypeFeedback3 from '@/assets/face-type-feedback/face_type_feedback3.png';
import faceTypeFeedback4 from '@/assets/face-type-feedback/face_type_feedback4.png';
import faceTypeFeedback5 from '@/assets/face-type-feedback/face_type_feedback5.png';
import faceTypeFeedback6 from '@/assets/face-type-feedback/face_type_feedback6.png';
import faceTypeFeedback7 from '@/assets/face-type-feedback/face_type_feedback7.png';
import faceTypeFeedback8 from '@/assets/face-type-feedback/face_type_feedback8.png';
import { format } from 'date-fns';
import { getApiError } from '@/shared/lib/error-handler';
import { goDesignerProfilePage } from '@/shared/lib/go-designer-profile-page';
import {
  openHairConsultationBillingInApp,
  registerHairConsultationBillingInApp,
} from '@/shared/lib/app-bridge';
import hairBangStyleFeedbackF1 from '@/assets/hair-bang-style-feedback/hair_bang_style_fedback_f1.png';
import hairBangStyleFeedbackF2 from '@/assets/hair-bang-style-feedback/hair_bang_style_fedback_f2.png';
import hairBangStyleFeedbackF3 from '@/assets/hair-bang-style-feedback/hair_bang_style_fedback_f3.png';
import hairBangStyleFeedbackF4 from '@/assets/hair-bang-style-feedback/hair_bang_style_fedback_f4.png';
import hairBangStyleFeedbackM1 from '@/assets/hair-bang-style-feedback/hair_bang_style_fedback_m1.png';
import hairBangStyleFeedbackM2 from '@/assets/hair-bang-style-feedback/hair_bang_style_fedback_m2.png';
import hairBangStyleFeedbackM3 from '@/assets/hair-bang-style-feedback/hair_bang_style_fedback_m3.png';
import hairBangStyleFeedbackM4 from '@/assets/hair-bang-style-feedback/hair_bang_style_fedback_m4.png';
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
import useCreateMongWithdrawMutation from '@/features/mong/api/use-create-mong-withdraw-mutation';
import useGetHairConsultationAnswerDetail from '@/features/posts/api/use-get-hair-consultation-answer-detail';
import useGetHairConsultationDetail from '@/features/posts/api/use-get-hair-consultation-detail';
import useGetMongConsumePresets from '@/features/mong/api/use-get-mong-consume-presets';
import useGetMongCurrent from '@/features/mong/api/use-get-mong-current';
import useMeemongPassPolicy from '@/features/ad-block/hook/use-meemong-pass-policy';
import { useOptionalAuthContext } from '@/features/auth/context/auth-context';
import { useOptionalBrand } from '@/shared/context/brand-context';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowModal from '@/shared/ui/hooks/use-show-modal';
import useShowMongInsufficientSheet from '@/features/mong/hook/use-show-mong-insufficient-sheet';
import useStartChat from '@/features/chat/hook/use-start-chat';
import { cn } from '@/shared/lib/utils';
import formatAddress from '@/features/auth/lib/format-address';
import { MeemongTypography } from '@/shared/styles/typography';
import HairConsultingImage from '@/features/posts/ui/consulting-response/hair-consulting-image';
import Dot from '@/shared/ui/dot';

const formatAnswerDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return format(date, 'yyyy.MM.dd');
};

const formatDesignerName = (displayName: string) =>
  displayName.includes('디자이너') ? displayName : `${displayName} 디자이너`;

const formatDistance = (distance: number | null | undefined) => {
  if (distance == null || !Number.isFinite(distance) || distance < 0) return null;

  return `${new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 1 }).format(distance)}km`;
};

const isAdviceRequired = (advice: boolean | number | null | undefined) =>
  advice === true || advice === 1;

const normalizeText = (value: string) =>
  value
    .normalize('NFKC')
    .replace(/[\s\u200B-\u200D\uFEFF]/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '')
    .toLowerCase();

const isMaleSex = (sex: string | number | null | undefined) =>
  sex === '남자' || sex === 'MALE' || sex === 'male' || sex === 1 || sex === '1';

const getConsultationPostWriterId = (detail?: HairConsultationDetail | null) => {
  const writerIds = [
    detail?.user?.id,
    detail?.hairConsultationCreateUserId,
    detail?.hairConsultationCreateUser?.userId,
  ].filter((id): id is number => typeof id === 'number');
  const uniqueWriterIds = new Set(writerIds);

  return uniqueWriterIds.size === 1 ? writerIds[0] : null;
};

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
  롱: hairLengthFeedbackF6,
  // Backward compatibility for legacy female values.
  장발: hairLengthFeedbackF6,
};
const BANG_STYLE_FEEDBACK_IMAGE_MAP: Record<string, ImageSource> = {
  [BANG_STYLE.MALE_COVERED]: hairBangStyleFeedbackM1,
  [BANG_STYLE.MALE_PARTED]: hairBangStyleFeedbackM2,
  [BANG_STYLE.MALE_SWEPT_BACK]: hairBangStyleFeedbackM3,
  [BANG_STYLE.MALE_UP]: hairBangStyleFeedbackM4,
  [BANG_STYLE.FEMALE_NO_BANGS]: hairBangStyleFeedbackF1,
  [BANG_STYLE.FEMALE_SIDE_CURTAIN]: hairBangStyleFeedbackF2,
  [BANG_STYLE.FEMALE_SEE_THROUGH]: hairBangStyleFeedbackF3,
  [BANG_STYLE.FEMALE_FULL]: hairBangStyleFeedbackF4,
};
const FACE_TYPE_FEEDBACK_IMAGE_MAP: Record<string, ImageSource> = {
  [FACE_SHAPE.OVAL]: faceTypeFeedback1,
  [FACE_SHAPE.DIAMOND]: faceTypeFeedback2,
  [FACE_SHAPE.LONG]: faceTypeFeedback3,
  [FACE_SHAPE.ROUND]: faceTypeFeedback4,
  [FACE_SHAPE.SQUARE]: faceTypeFeedback5,
  [FACE_SHAPE.HEART]: faceTypeFeedback6,
  [FACE_SHAPE.PEANUT]: faceTypeFeedback7,
  [FACE_SHAPE.HEXAGONAL]: faceTypeFeedback8,
};
const LEGACY_BANG_STYLE_ALIAS_MAP: Record<string, BangStyleOptionNew['value']> = {
  [normalizeText('이마를 가리는 스타일')]: BANG_STYLE.MALE_COVERED,
  [normalizeText('이마가 보이는 스타일')]: BANG_STYLE.MALE_PARTED,
  [normalizeText('이마가 살짝 보이는 스타일')]: BANG_STYLE.MALE_PARTED,
  [normalizeText('이마를 드러내는 스타일')]: BANG_STYLE.MALE_UP,
  [normalizeText('앞머리 없는 스타일')]: BANG_STYLE.FEMALE_NO_BANGS,
  [normalizeText('앞머리 넘기는 스타일')]: BANG_STYLE.FEMALE_SIDE_CURTAIN,
  [normalizeText('앞머리 내리는 스타일')]: BANG_STYLE.FEMALE_SEE_THROUGH,
};

const findBangStyleOption = (label: string, primaryOptions: BangStyleOptionNew[]) => {
  const normalizedLabel = normalizeText(label);
  const matchedOption =
    primaryOptions.find(
      (option) =>
        normalizeText(option.title) === normalizedLabel ||
        normalizeText(BANG_STYLE_LABEL[option.value]) === normalizedLabel,
    ) ??
    ALL_BANG_STYLE_OPTIONS.find(
      (option) =>
        normalizeText(option.title) === normalizedLabel ||
        normalizeText(BANG_STYLE_LABEL[option.value]) === normalizedLabel,
    );

  if (matchedOption) return matchedOption;

  const aliasValue = LEGACY_BANG_STYLE_ALIAS_MAP[normalizedLabel];
  if (!aliasValue) return undefined;

  return (
    primaryOptions.find((option) => option.value === aliasValue) ??
    ALL_BANG_STYLE_OPTIONS.find((option) => option.value === aliasValue)
  );
};

const findHairLengthOption = (value: string | null, primaryOptions: HairLengthOption[]) => {
  const normalizedValue = normalizeText(value ?? '');

  return primaryOptions.find(
    (option) =>
      normalizeText(option.value ?? '') === normalizedValue ||
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

const getHairLengthFeedbackImage = (value: string | null, isMale: boolean) => {
  const normalizedValue = normalizeText(value ?? '');
  const imageMap = isMale
    ? MALE_HAIR_LENGTH_FEEDBACK_IMAGE_MAP
    : FEMALE_HAIR_LENGTH_FEEDBACK_IMAGE_MAP;

  const matchedKey = Object.keys(imageMap).find((key) => normalizeText(key) === normalizedValue);

  return matchedKey ? imageMap[matchedKey] : undefined;
};

const normalizeHairLengthBySex = (
  value: string | null | undefined,
  isMale: boolean,
): string | null => {
  if (!value) return null;
  if (!isMale && value === '장발') return '롱';
  return value;
};

const getBangStyleFeedbackImage = (value: string | null | undefined) => {
  if (!value) return undefined;
  return BANG_STYLE_FEEDBACK_IMAGE_MAP[value];
};

const getFaceTypeFeedbackImage = (value: string | null | undefined) => {
  if (!value) return undefined;
  return FACE_TYPE_FEEDBACK_IMAGE_MAP[value];
};

function StoreConsultingNotice() {
  return (
    <div className="rounded-8 bg-background-weak p-3">
      <p className={cn('text-text-secondary', MeemongTypography.body4Regular)}>
        매장 상담이 필요합니다.
      </p>
    </div>
  );
}

function SubsectionTitle({ children }: { children: string }) {
  return (
    <h3 className={cn('px-1 text-text-tertiary', MeemongTypography.title3SemiBold)}>{children}</h3>
  );
}

function RecommendationPreviewRows({ items }: { items: RecommendationPreviewItem[] }) {
  if (items.length === 0) {
    return <p className={cn('text-text-tertiary', MeemongTypography.body3Regular)}>-</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.key} className="flex min-h-[140px] items-start gap-2">
          {item.imageSrc ? (
            <HairConsultingImage src={item.imageSrc} alt={item.label} />
          ) : (
            <div
              className={cn(
                'flex size-[140px] shrink-0 items-center justify-center rounded-8 border border-border-weak bg-background-weak text-text-tertiary',
                MeemongTypography.body4Regular,
              )}
            >
              이미지 없음
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
            <p className={cn('break-words text-text-primary', MeemongTypography.body1SemiBold)}>
              {item.label}
            </p>
            <p className={cn('break-words text-text-primary', MeemongTypography.body3Regular)}>
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
  const { back } = useRouterWithUser();
  const auth = useOptionalAuthContext();
  const user = auth?.user ?? null;
  const isUserModel = auth?.isUserModel ?? false;
  const brand = useOptionalBrand();
  const showModal = useShowModal();
  const { startChat, findExistingChat, prepareChat, openPreparedChat } = useStartChat();

  const showAppOnlyModal = () => {
    const isIOS = /iPhone|iPad|iPod/i.test(
      typeof navigator !== 'undefined' ? navigator.userAgent : '',
    );
    showModal({
      id: 'app-only-feature-modal',
      text: (
        <div
          className={cn('whitespace-pre-line text-text-primary', MeemongTypography.body2Regular)}
        >
          {'디자이너 프로필 보기 및 추가상담은\n미몽 앱에서 가능합니다.'}
        </div>
      ),
      buttons: [
        {
          label: '앱 다운로드',
          typographyClassName: MeemongTypography.title2SemiBold,
          className: 'text-status-information-regular',
          onClick: () => {
            window.open(
              isIOS
                ? 'https://apps.apple.com/kr/app/%EB%AF%B8%EB%AA%BD-%EB%8B%B9%EC%8B%A0%EB%8F%84-%ED%97%A4%EC%96%B4%EB%AA%A8%EB%8D%B8/id1572588554'
                : 'https://play.google.com/store/apps/details?id=com.meemong.second',
              '_blank',
            );
          },
        },
        {
          label: '닫기',
          typographyClassName: MeemongTypography.body2Medium,
          className: 'text-text-primary',
        },
      ],
    });
  };
  const { canSkipMong } = useMeemongPassPolicy();
  const { mutateAsync: createMongWithdraw } = useCreateMongWithdrawMutation();
  const { showSnackBar, showBottomSheet } = useOverlayContext();
  const showMongInsufficientSheet = useShowMongInsufficientSheet();
  const { data: presetsData } = useGetMongConsumePresets();
  const { data: mongCurrentData, refetch: refetchMongCurrent } = useGetMongCurrent();
  const postIdString = postId?.toString() ?? '';
  const responseIdString = responseId?.toString() ?? '';
  const [isStartingChat, setIsStartingChat] = useState(false);

  const { data: response, error } = useGetHairConsultationAnswerDetail(
    postIdString,
    responseIdString,
  );
  const {
    data: consultationDetailResponse,
    isLoading: isConsultationDetailLoading,
    refetch: refetchConsultationDetail,
  } = useGetHairConsultationDetail(postIdString);

  useEffect(() => {
    registerHairConsultationBillingInApp();
  }, []);

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

  const postWriterId = getConsultationPostWriterId(consultationDetail);
  const isResponseWriter = user != null && user.id === answer.user.id;
  const isPostWriter = postWriterId != null && user != null && user.id === postWriterId;
  const shouldSkipAdditionalConsultationMong = isUserModel && isPostWriter;
  const isCheckingPostWriter =
    !brand && isUserModel && postWriterId == null && isConsultationDetailLoading;
  const shouldShowBottomActions = brand ? true : isUserModel && !isResponseWriter;

  const handleDesignerProfileClick = () => {
    if (brand) {
      showAppOnlyModal();
      return;
    }
    goDesignerProfilePage(answer.user.id.toString(), {
      postId: postIdString,
      answerId: responseIdString,
      entrySource: 'CONSULTING_RESPONSE',
      isMyHairConsultationPost: isPostWriter,
      isConsultingDetailEntry: true,
    });
  };

  const startConsultingResponseChat = async (isMyHairConsultationPost = isPostWriter) => {
    setIsStartingChat(true);
    try {
      const started = await startChat({
        receiverId: answer.user.id,
        postId: postIdString,
        answerId: responseIdString,
        entrySource: 'CONSULTING_RESPONSE',
        isMyHairConsultationPost,
      });
      if (!started) {
        showSnackBar({
          type: 'error',
          message: '채팅 연결에 실패했어요. 잠시 후 다시 시도해주세요.',
        });
      }
    } finally {
      setIsStartingChat(false);
    }
  };

  const startChatWithMong = async () => {
    // 유료 확인 시트가 stale render에서 열려도 내 글 추가 상담은 차감하지 않는다.
    if (shouldSkipAdditionalConsultationMong) {
      await startConsultingResponseChat();
      return;
    }

    const createType = MEEMONG_PASS_CREATE_TYPES.OTHER_HAIR_CONSULTATIONS_ANSWER_CHAT_MODEL;

    setIsStartingChat(true);
    try {
      const existingChat = await findExistingChat({
        receiverId: answer.user.id,
        postId: postIdString,
        answerId: responseIdString,
        entrySource: 'CONSULTING_RESPONSE',
        isMyHairConsultationPost: isPostWriter,
      });
      const preparedChat =
        existingChat ??
        (await prepareChat({
          receiverId: answer.user.id,
          postId: postIdString,
          answerId: responseIdString,
          entrySource: 'CONSULTING_RESPONSE',
          isMyHairConsultationPost: isPostWriter,
        }));

      if (!preparedChat) {
        showSnackBar({
          type: 'error',
          message: '채팅을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.',
        });
        return;
      }

      if (!existingChat) {
        await createMongWithdraw({ createType });
      }

      const opened = await openPreparedChat({
        ...preparedChat,
        nativeAccessReason: existingChat ? 'EXISTING_CHAT' : 'MONG_WITHDRAWN',
      });
      if (!opened) {
        showSnackBar({
          type: 'error',
          message: '채팅 연결에 실패했어요. 잠시 후 다시 시도해주세요.',
        });
        return;
      }
    } catch (error) {
      const apiError = getApiError(error);
      if (apiError.code === 'NOT_ENOUGH_MONG_MONEY' || apiError.httpCode === 409) {
        showMongInsufficientSheet();
        return;
      }
      showSnackBar({
        type: 'error',
        message: apiError.message || '채팅 연결에 실패했어요. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleChatClick = async () => {
    if (brand) {
      showAppOnlyModal();
      return;
    }
    if (isStartingChat) return;

    let isMyHairConsultationPost = isPostWriter;

    if (isUserModel && postWriterId == null) {
      if (isConsultationDetailLoading) {
        showSnackBar({
          type: 'error',
          message: '게시글 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.',
        });
        return;
      }

      setIsStartingChat(true);
      try {
        const latestConsultationDetailResponse = await refetchConsultationDetail();
        const latestPostWriterId = getConsultationPostWriterId(
          latestConsultationDetailResponse.data?.data,
        );

        if (latestPostWriterId == null) {
          showSnackBar({
            type: 'error',
            message: '게시글 정보를 불러오지 못했어요. 다시 시도해주세요.',
          });
          return;
        }

        isMyHairConsultationPost = user != null && user.id === latestPostWriterId;
      } finally {
        setIsStartingChat(false);
      }
    }

    if (!isUserModel) {
      await startConsultingResponseChat(isMyHairConsultationPost);
      return;
    }

    if (isMyHairConsultationPost) {
      await startConsultingResponseChat(isMyHairConsultationPost);
      return;
    }

    const createType = MEEMONG_PASS_CREATE_TYPES.OTHER_HAIR_CONSULTATIONS_ANSWER_CHAT_MODEL;

    const existingChat = await findExistingChat({
      receiverId: answer.user.id,
      postId: postIdString,
      answerId: responseIdString,
      entrySource: 'CONSULTING_RESPONSE',
      isMyHairConsultationPost,
    });

    if (existingChat) {
      setIsStartingChat(true);
      try {
        const opened = await openPreparedChat({
          ...existingChat,
          nativeAccessReason: 'EXISTING_CHAT',
        });
        if (!opened) {
          showSnackBar({
            type: 'error',
            message: '채팅 연결에 실패했어요. 잠시 후 다시 시도해주세요.',
          });
        }
      } finally {
        setIsStartingChat(false);
      }
      return;
    }

    const openedNativeBilling = openHairConsultationBillingInApp({
      type: 'START_CONSULTATION_CHAT',
      designerName: answer.user.displayName,
      receiverId: answer.user.id,
      postId: postIdString,
      answerId: responseIdString,
      entrySource: 'CONSULTING_RESPONSE',
      isMyHairConsultationPost,
    });
    if (openedNativeBilling) {
      return;
    }

    if (canSkipMong(createType)) {
      await startConsultingResponseChat(isMyHairConsultationPost);
      return;
    }

    const CHAT_SHEET_ID = 'consulting-response-chat-confirm-sheet';
    const hairConsultingPresets =
      presetsData?.dataList?.filter((p) => p.type === 'HAIR_CONSULTING') ?? [];
    const preset = hairConsultingPresets.find((p) => p.subType === createType);
    const price = preset?.price;
    const latestMongCurrentResponse = await refetchMongCurrent();
    const currentMongAmount =
      latestMongCurrentResponse.data?.data?.currentTotalAmount ??
      mongCurrentData?.data?.currentTotalAmount;

    showBottomSheet({
      id: CHAT_SHEET_ID,
      hideHandle: true,
      children: (
        <>
          <DrawerHeader>
            <DrawerTitle showCloseButton />
            <DrawerDescription>
              <span className="flex flex-col gap-2">
                <span className={cn('text-text-primary', MeemongTypography.heading2Bold)}>
                  {answer.user.displayName} 디자이너와
                  <br />
                  추가 상담을 시작할까요?
                </span>
                <span className={cn('text-text-secondary', MeemongTypography.body2Regular)}>
                  내 잔여 몽:{' '}
                  <span className={cn('text-negative-light', MeemongTypography.title2SemiBold)}>
                    {currentMongAmount != null ? `${currentMongAmount}몽` : '불러오는 중'}
                  </span>
                </span>
              </span>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter
            buttons={[
              <DrawerClose asChild key="cancel">
                <MeemongButton tone="secondary">취소</MeemongButton>
              </DrawerClose>,
              <DrawerClose asChild key="confirm">
                <MeemongButton
                  disabled={price == null || isStartingChat}
                  onClick={startChatWithMong}
                >
                  {price != null ? `${price}몽 사용` : '채팅하기'}
                </MeemongButton>
              </DrawerClose>,
            ]}
          />
        </>
      ),
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
        imageSrc: getBangStyleFeedbackImage(option?.value) ?? option?.unselectedImage,
      };
    },
  );

  const hairLengthItems: RecommendationPreviewItem[] = (answer.hairLengths ?? []).map(
    (hairLength, index) => {
      const normalizedHairLength = normalizeHairLengthBySex(hairLength, isMale);
      const option = findHairLengthOption(normalizedHairLength, hairLengthOptions);

      return {
        key: `${hairLength}-${index}`,
        label: option?.label ?? normalizedHairLength ?? hairLength,
        description: option?.description ?? '기장 설명 정보가 없습니다.',
        imageSrc: getHairLengthFeedbackImage(normalizedHairLength, isMale) ?? option?.image,
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

  const designerDisplayName = answer.user.displayName?.trim() || '디자이너';
  const designerNameWithRole = formatDesignerName(designerDisplayName);
  const designerAddress = answer.user.address ? formatAddress(answer.user.address) : null;
  const designerDistance = formatDistance(answer.user.distance);

  return (
    <main className="mx-auto h-dvh min-w-[375px] w-full overflow-y-auto bg-background-white scrollbar-hide">
      <div className="flex min-h-full flex-col">
        <div className="bg-brand-core">
          <MeemongTopBar reverse onBackClick={back} />

          <section className="flex flex-col gap-4 px-4 pt-4 pb-6">
            <div className="flex flex-col gap-1">
              <h1
                className={cn(
                  'whitespace-pre-line text-text-inverse',
                  MeemongTypography.heading2Bold,
                )}
              >
                {`${designerDisplayName}님의\n컨설팅 답변이 도착했어요`}
              </h1>
              <p className={cn('text-text-tertiary', MeemongTypography.body4Regular)}>
                {formatAnswerDate(answer.createdAt)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDesignerProfileClick}
              className="flex w-full items-center gap-2 rounded-10 bg-fill-strong px-4 py-3 text-left"
            >
              <Avatar className="size-11 rounded-full">
                {answer.user.profilePictureURL ? (
                  <AvatarImage
                    src={answer.user.profilePictureURL}
                    className="size-11 rounded-full"
                  />
                ) : (
                  <AvatarFallback className="size-11 rounded-full bg-fill-medium text-text-inverse">
                    <span className={MeemongTypography.title2SemiBold}>
                      {designerDisplayName.slice(0, 1)}
                    </span>
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className={cn('truncate text-text-inverse', MeemongTypography.body2Medium)}>
                  {designerNameWithRole}
                </p>
                {(designerAddress || designerDistance) && (
                  <div
                    className={cn(
                      'flex min-w-0 items-center gap-1 text-text-tertiary',
                      MeemongTypography.body4Regular,
                    )}
                  >
                    {designerAddress && <span className="truncate">{designerAddress}</span>}
                    {designerAddress && designerDistance && (
                      <Dot size="1" className="shrink-0 bg-current" />
                    )}
                    {designerDistance && <span className="shrink-0">{designerDistance}</span>}
                  </div>
                )}
              </div>
              <span className="sr-only">프로필 보기</span>
            </button>
          </section>
        </div>

        <section className="flex flex-col gap-6 px-4 py-6">
          <div className="flex w-full flex-col gap-4">
            <MeemongContentsTitle title="얼굴형 분석 결과" />

            <div className="flex flex-col gap-1">
              <SubsectionTitle>얼굴형</SubsectionTitle>
              {needsFaceShapeConsulting ? (
                <StoreConsultingNotice />
              ) : faceTypeOption ? (
                <div className="flex min-h-[140px] items-start gap-2">
                  <HairConsultingImage
                    src={
                      getFaceTypeFeedbackImage(faceTypeOption.value) ?? faceTypeOption.emptyImage
                    }
                    alt={faceTypeOption.label}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1 pt-0.5">
                    <p
                      className={cn(
                        'break-words text-text-primary',
                        MeemongTypography.body1SemiBold,
                      )}
                    >
                      {faceTypeOption.label}
                    </p>
                    <p
                      className={cn(
                        'break-words text-text-primary',
                        MeemongTypography.body3Regular,
                      )}
                    >
                      {faceTypeOption.description}
                    </p>
                  </div>
                </div>
              ) : (
                <p className={cn('text-text-tertiary', MeemongTypography.body3Regular)}>-</p>
              )}
            </div>
          </div>

          <MeemongDivider />

          <div className="flex w-full flex-col gap-4">
            <MeemongContentsTitle title="추천 헤어 스타일" />

            <div className="flex flex-col gap-1">
              <SubsectionTitle>추천 앞머리</SubsectionTitle>
              {needsBangStyleConsulting ? (
                <StoreConsultingNotice />
              ) : (
                <RecommendationPreviewRows items={bangStyleItems} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <SubsectionTitle>추천 기장</SubsectionTitle>
              {needsHairLengthConsulting ? (
                <StoreConsultingNotice />
              ) : (
                <RecommendationPreviewRows items={hairLengthItems} />
              )}
            </div>

            {shouldShowLayerSection && (
              <div className="flex flex-col gap-2">
                <SubsectionTitle>추천 레이어</SubsectionTitle>
                {needsHairLayerConsulting ? (
                  <StoreConsultingNotice />
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {(answer.hairLayers ?? []).map((layer, index) => (
                      <MeemongChip key={`${layer}-${index}`}>{layer}</MeemongChip>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <SubsectionTitle>추천 컬</SubsectionTitle>
              {needsHairCurlConsulting ? (
                <StoreConsultingNotice />
              ) : hairCurlValues.length === 0 ? (
                <p className={cn('text-text-tertiary', MeemongTypography.body3Regular)}>-</p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {hairCurlValues.map((hairCurl, index) => (
                    <MeemongChip key={`${hairCurl}-${index}`}>{hairCurl}</MeemongChip>
                  ))}
                </div>
              )}
            </div>
          </div>

          <MeemongCallout
            title="제공해 주신 사진을 바탕으로 분석한 결과예요"
            description="정확한 상담은 매장 방문을 통해 진행해 주세요"
          />
        </section>

        <MeemongDivider thickness="8px" />

        <section className="flex flex-col gap-5 overflow-hidden px-4 py-6">
          <MeemongContentsTitle
            title="추천하는 시술"
            description={`${designerDisplayName}님이 분석 결과에 맞는 시술을 제안했어요`}
          />

          <div className="flex w-full flex-col gap-4">
            {answer.styleImages && answer.styleImages.length > 0 && (
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex w-max gap-2">
                  {answer.styleImages.map((imageUrl: string, index: number) => (
                    <Image
                      key={`${imageUrl}-${index}`}
                      src={imageUrl}
                      alt={`추천 시술 이미지 ${index + 1}`}
                      width={140}
                      height={140}
                      unoptimized
                      className="size-[140px] shrink-0 rounded-8 object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex w-full flex-col gap-2 rounded-12 border border-border-weak px-3 py-4">
              <div className="flex min-w-0 items-center">
                <p
                  className={cn(
                    'w-14 shrink-0 text-text-tertiary',
                    MeemongTypography.title3SemiBold,
                  )}
                >
                  시술명
                </p>
                <p
                  title={answer.title || '-'}
                  className={cn(
                    'min-w-0 flex-1 truncate text-text-primary',
                    MeemongTypography.body2Medium,
                  )}
                >
                  {answer.title || '-'}
                </p>
              </div>
              <div className="flex min-w-0 items-center">
                <p
                  className={cn(
                    'w-14 shrink-0 text-text-tertiary',
                    MeemongTypography.title3SemiBold,
                  )}
                >
                  가격
                </p>
                <p
                  title={priceText}
                  className={cn(
                    'min-w-0 flex-1 truncate text-text-primary',
                    MeemongTypography.body2Medium,
                  )}
                >
                  {priceText}
                </p>
              </div>
            </div>

            {answer.description && (
              <p
                className={cn(
                  'whitespace-pre-wrap break-words text-text-primary',
                  MeemongTypography.body2Regular,
                )}
              >
                {answer.description}
              </p>
            )}
          </div>
        </section>

        {shouldShowBottomActions && (
          <MeemongBottomActionBar className="mt-auto">
            <MeemongButton
              className="w-full"
              onClick={handleChatClick}
              disabled={isStartingChat || isCheckingPostWriter}
            >
              {isStartingChat ? '연결 중...' : '추가 상담하기'}
            </MeemongButton>
          </MeemongBottomActionBar>
        )}
      </div>
    </main>
  );
}
