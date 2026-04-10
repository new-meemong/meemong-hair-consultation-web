import { useSearchParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';

import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';
import { useOptionalAuthContext } from '@/features/auth/context/auth-context';
import useStartChat from '@/features/chat/hook/use-start-chat';
import type { CommentFormState } from '@/features/comments/types/comment-form-state';
import useCreateMongWithdrawMutation from '@/features/mong/api/use-create-mong-withdraw-mutation';
import useGetMongConsumePresets from '@/features/mong/api/use-get-mong-consume-presets';
import useGetMongCurrent from '@/features/mong/api/use-get-mong-current';
import useShowMongInsufficientSheet from '@/features/mong/hook/use-show-mong-insufficient-sheet';
import { CommentForm, type CommentFormValues } from '@/features/comments/ui/comment-form';
import useWritingConsultingResponse from '@/features/posts/hooks/use-writing-consulting-response';
import { ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { getApiError } from '@/shared/lib/error-handler';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { detectExternalContact } from '@/shared/lib/detect-external-contact';
import useShowModal from '@/shared/ui/hooks/use-show-modal';
import { Button } from '@/shared/ui/button';

type ConsultingChatTarget = {
  receiverId: number;
  receiverName: string;
  answerId: string;
};

type CommentFormContainerProps = {
  postId: string;
  commentFormState: CommentFormState;
  onSubmit: (
    data: CommentFormValues,
    options: {
      onSuccess: () => void;
    },
  ) => void;
  isPending: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  isConsulting: boolean;
  isAnsweredByDesigner: boolean;
  consultingChatTarget?: ConsultingChatTarget;
  onRestrictedBrandAttempt?: () => void;
};

export default function CommentFormContainer({
  postId,
  onSubmit,
  commentFormState,
  isPending,
  textareaRef,
  isConsulting,
  isAnsweredByDesigner,
  consultingChatTarget,
  onRestrictedBrandAttempt,
}: CommentFormContainerProps) {
  const searchParams = useSearchParams();
  const postListTab = searchParams.get(SEARCH_PARAMS.POST_LIST_TAB) ?? 'latest';

  const { push } = useRouterWithUser();
  const auth = useOptionalAuthContext();
  const isUserDesigner = auth?.isUserDesigner ?? false;
  const showModal = useShowModal();
  const { showBottomSheet, showSnackBar } = useOverlayContext();
  const { findExistingChat, prepareChat, openPreparedChat } = useStartChat();
  const { mutateAsync: createMongWithdraw } = useCreateMongWithdrawMutation();
  const { data: presetsData } = useGetMongConsumePresets();
  const { data: mongCurrentData, refetch: refetchMongCurrent } = useGetMongCurrent();
  const showMongInsufficientSheet = useShowMongInsufficientSheet();

  const isCommentFormReply = commentFormState.state === 'reply';

  const canShowConsultingResponseControls = isConsulting && isUserDesigner && !isCommentFormReply;
  const canWriteConsultingResponse = canShowConsultingResponseControls && !isAnsweredByDesigner;
  const canStartConsultingChat =
    canShowConsultingResponseControls && isAnsweredByDesigner && consultingChatTarget != null;

  const [commentMode, setCommentMode] = useState<'consulting' | 'normal'>(
    canShowConsultingResponseControls ? 'consulting' : 'normal',
  );
  const [isStartingChat, setIsStartingChat] = useState(false);
  const isConsultingChatClickLockedRef = useRef(false);

  const handleNormalCommentClick = useCallback(() => {
    if (onRestrictedBrandAttempt) {
      onRestrictedBrandAttempt();
      return;
    }
    setCommentMode('normal');
  }, [onRestrictedBrandAttempt]);

  const { hasSavedContent } = useWritingConsultingResponse(postId);

  const writingResponseButtonText = canStartConsultingChat
    ? '글쓴이와 채팅하기'
    : isAnsweredByDesigner
      ? '이미 답변한 글입니다'
      : hasSavedContent
        ? '이어서 작성하기'
        : '컨설팅 답변하기';

  const handleWriteConsultingResponseClick = () => {
    if (onRestrictedBrandAttempt) {
      onRestrictedBrandAttempt();
      return;
    }

    const path = ROUTES.POSTS_CREATE_CONSULTING_POST(postId.toString());

    push(path, {
      [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
    });
  };

  const handleConsultingChatClick = useCallback(async () => {
    if (!consultingChatTarget || isStartingChat || isConsultingChatClickLockedRef.current) return;

    if (onRestrictedBrandAttempt) {
      onRestrictedBrandAttempt();
      return;
    }

    isConsultingChatClickLockedRef.current = true;

    try {
      const existingChat = await findExistingChat({
        receiverId: consultingChatTarget.receiverId,
        postId,
        answerId: consultingChatTarget.answerId,
        entrySource: 'POST_COMMENT',
        isMyHairConsultationPost: false,
      });

      if (existingChat) {
        setIsStartingChat(true);
        try {
          const opened = await openPreparedChat(existingChat);
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

      const chatSheetId = 'consulting-post-chat-confirm-sheet';
      const hairConsultingPresets =
        presetsData?.dataList?.filter((preset) => preset.type === 'HAIR_CONSULTING') ?? [];
      const chatPreset = hairConsultingPresets.find(
        (preset) => preset.subType === 'HAIR_CONSULTATIONS_CHAT_DESIGNER',
      );
      const price = chatPreset?.price;
      const latestMongCurrentResponse = await refetchMongCurrent();
      const currentMongAmount =
        latestMongCurrentResponse.data?.data?.currentTotalAmount ??
        mongCurrentData?.data?.currentTotalAmount;

      showBottomSheet({
        id: chatSheetId,
        hideHandle: true,
        children: (
          <>
            <DrawerHeader>
              <DrawerTitle showCloseButton />
              <DrawerDescription>
                <span className="flex flex-col gap-2">
                  <span className="typo-title-2-semibold text-label-strong whitespace-pre-line">
                    {`${consultingChatTarget.receiverName}님과\n대화를 시작하시겠어요?`}
                  </span>
                  <span className="typo-body-1-long-regular text-label-sub">
                    내 잔여 몽:{' '}
                    <span className="typo-body-1-semibold text-negative-light">
                      {currentMongAmount != null ? `${currentMongAmount}몽` : '불러오는 중'}
                    </span>
                  </span>
                </span>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter
              buttons={[
                <DrawerClose asChild key="cancel">
                  <Button theme="white" size="lg" className="rounded-4">
                    취소
                  </Button>
                </DrawerClose>,
                <DrawerClose asChild key="confirm">
                  <Button
                    size="lg"
                    className="rounded-4"
                    disabled={price == null || isStartingChat}
                    onClick={async () => {
                      setIsStartingChat(true);

                      try {
                        const existingChat = await findExistingChat({
                          receiverId: consultingChatTarget.receiverId,
                          postId,
                          answerId: consultingChatTarget.answerId,
                          entrySource: 'POST_COMMENT',
                          isMyHairConsultationPost: false,
                        });
                        const preparedChat =
                          existingChat ??
                          (await prepareChat({
                            receiverId: consultingChatTarget.receiverId,
                            postId,
                            answerId: consultingChatTarget.answerId,
                            entrySource: 'POST_COMMENT',
                            isMyHairConsultationPost: false,
                          }));

                        if (!preparedChat) {
                          showSnackBar({
                            type: 'error',
                            message: '채팅을 시작할 수 없습니다. 잠시 후 다시 시도해주세요.',
                          });
                          return;
                        }

                        if (!existingChat) {
                          await createMongWithdraw({
                            createType: 'HAIR_CONSULTATIONS_CHAT_DESIGNER',
                          });
                        }

                        const opened = await openPreparedChat(preparedChat);
                        if (!opened) {
                          showSnackBar({
                            type: 'error',
                            message: '채팅 연결에 실패했어요. 잠시 후 다시 시도해주세요.',
                          });
                          return;
                        }
                      } catch (error) {
                        const apiError = getApiError(error);
                        if (
                          apiError.code === 'NOT_ENOUGH_MONG_MONEY' ||
                          apiError.httpCode === 409
                        ) {
                          showMongInsufficientSheet();
                          return;
                        }

                        showSnackBar({
                          type: 'error',
                          message:
                            apiError.message ||
                            '채팅 연결에 실패했어요. 잠시 후 다시 시도해주세요.',
                        });
                      } finally {
                        setIsStartingChat(false);
                      }
                    }}
                  >
                    {price != null ? `채팅하기 ${price}몽` : '채팅하기'}
                  </Button>
                </DrawerClose>,
              ]}
            />
          </>
        ),
      });
    } catch {
      showSnackBar({
        type: 'error',
        message: '채팅 연결에 실패했어요. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      isConsultingChatClickLockedRef.current = false;
    }
  }, [
    consultingChatTarget,
    createMongWithdraw,
    findExistingChat,
    isStartingChat,
    mongCurrentData?.data?.currentTotalAmount,
    onRestrictedBrandAttempt,
    openPreparedChat,
    postId,
    presetsData?.dataList,
    prepareChat,
    refetchMongCurrent,
    showBottomSheet,
    showMongInsufficientSheet,
    showSnackBar,
  ]);

  const handleCommentFormSubmit = useCallback(
    (data: CommentFormValues, options: { onSuccess: () => void }) => {
      if (onRestrictedBrandAttempt) {
        onRestrictedBrandAttempt();
        return;
      }

      // 디자이너가 모델의 헤어컨설팅글에 일반댓글 작성 시 항상 모달 표시
      const shouldShowModal =
        isUserDesigner && isConsulting && commentMode === 'normal' && !isCommentFormReply;

      if (shouldShowModal) {
        const hasExternalContact = detectExternalContact(data.content);

        showModal({
          id: 'external-contact-warning-modal',
          text: (
            <div className="typo-body-1-long-regular whitespace-pre-line">
              댓글에 외부 연락처(
              <span className="font-bold">인스타, 카톡 등</span>)가
              {'\n'}
              포함되어 있다면 수정해 주세요.
              {'\n'}
              위반 시 계정이 정지될 수 있습니다.
            </div>
          ),
          buttons: [
            {
              label: '수정하기',
              textColor: 'text-label-default',
              variant: 'default',
            },
            {
              label: '등록하기',
              textColor: 'text-positive',
              variant: 'primary',
              disabled: hasExternalContact,
              onClick: () => {
                onSubmit(data, options);
              },
            },
          ],
        });
        return;
      }

      // 검증이 필요 없는 경우 바로 제출
      onSubmit(data, options);
    },
    [
      onRestrictedBrandAttempt,
      isUserDesigner,
      isConsulting,
      commentMode,
      isCommentFormReply,
      showModal,
      onSubmit,
    ],
  );

  return (
    <div className="relative">
      {canWriteConsultingResponse && commentMode === 'normal' && (
        <Button
          className="absolute -top-14 left-1/2 transform -translate-x-1/2 rounded-4 bg-label-default py-[9.5px] px-3 shadow-strong typo-body-2-medium"
          onClick={handleWriteConsultingResponseClick}
        >
          <div className="flex items-center gap-1 text-white">
            컨설팅 답변 작성
            <ChevronRightIcon className="size-4 fill-white" />
          </div>
        </Button>
      )}
      {canShowConsultingResponseControls && commentMode === 'consulting' ? (
        <div className="bg-white shadow-upper px-5 py-3">
          <div className="mx-auto flex w-full max-w-[335px] items-center gap-3">
            <Button
              size="md"
              theme="white"
              className="w-[68px] rounded-4 border border-border-default bg-white hover:bg-white active:bg-white focus:bg-white"
              onClick={handleNormalCommentClick}
            >
              일반댓글
            </Button>
            <Button
              size="md"
              disabled={(!canWriteConsultingResponse && !canStartConsultingChat) || isStartingChat}
              className="w-[264px] rounded-4 bg-label-default text-white hover:bg-label-default active:bg-label-default focus:bg-label-default disabled:bg-label-disable disabled:text-white"
              onClick={
                canStartConsultingChat
                  ? handleConsultingChatClick
                  : handleWriteConsultingResponseClick
              }
            >
              {isStartingChat ? '연결 중...' : writingResponseButtonText}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-strong">
          <div className="max-w-[600px] mx-auto">
            <CommentForm
              onSubmit={handleCommentFormSubmit}
              isReply={isCommentFormReply}
              commentId={commentFormState.commentId}
              content={commentFormState.content}
              isPending={isPending}
              textareaRef={textareaRef}
            />
          </div>
        </div>
      )}
    </div>
  );
}
