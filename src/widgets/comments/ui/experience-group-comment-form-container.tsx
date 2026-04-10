'use client';

import { useCallback, useRef, useState } from 'react';

import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer';
import useStartModelMatchingChat from '@/features/chat/hook/use-start-model-matching-chat';
import useIsFromApp from '@/features/chat/hook/use-is-from-app';
import type { CommentFormState } from '@/features/comments/types/comment-form-state';
import useCreateMongWithdrawMutation from '@/features/mong/api/use-create-mong-withdraw-mutation';
import useGetMongConsumePresets from '@/features/mong/api/use-get-mong-consume-presets';
import useGetMongCurrent from '@/features/mong/api/use-get-mong-current';
import useShowMongInsufficientSheet from '@/features/mong/hook/use-show-mong-insufficient-sheet';
import { CommentForm, type CommentFormValues } from '@/features/comments/ui/comment-form';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { hasOpenChatChannelBridge } from '@/shared/lib/app-bridge';
import { getApiError } from '@/shared/lib/error-handler';
import { Button } from '@/shared/ui/button';

type ExperienceGroupCommentFormContainerProps = {
  receiverId: number;
  receiverName: string;
  commentFormState: CommentFormState;
  onSubmit: (
    data: CommentFormValues,
    options: {
      onSuccess: () => void;
    },
  ) => void;
  isPending: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export default function ExperienceGroupCommentFormContainer({
  receiverId,
  receiverName,
  commentFormState,
  onSubmit,
  isPending,
  textareaRef,
}: ExperienceGroupCommentFormContainerProps) {
  const { showBottomSheet, showSnackBar } = useOverlayContext();
  const { findExistingModelMatchingChat, prepareModelMatchingChat, openPreparedModelMatchingChat } =
    useStartModelMatchingChat();
  const isFromApp = useIsFromApp();
  const { mutateAsync: createMongWithdraw } = useCreateMongWithdrawMutation();
  const { data: presetsData } = useGetMongConsumePresets();
  const { data: mongCurrentData, refetch: refetchMongCurrent } = useGetMongCurrent();
  const showMongInsufficientSheet = useShowMongInsufficientSheet();

  const [mode, setMode] = useState<'actions' | 'comment'>('actions');
  const [isStartingChat, setIsStartingChat] = useState(false);
  const isChatClickLockedRef = useRef(false);

  const isReplyOrEdit = commentFormState.state !== 'create';
  const shouldShowCommentForm = mode === 'comment' || isReplyOrEdit;
  const shouldShowFloatingChatButton = mode === 'comment' && commentFormState.state === 'create';

  const focusTextarea = useCallback(() => {
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  }, [textareaRef]);

  const handleCommentClick = useCallback(() => {
    setMode('comment');
    focusTextarea();
  }, [focusTextarea]);

  const handleChatClick = useCallback(async () => {
    if (isStartingChat || isChatClickLockedRef.current) return;

    if (!isFromApp) {
      showSnackBar({
        type: 'error',
        message: '체험단 채팅은 미몽 앱에서 가능합니다.',
      });
      return;
    }

    if (!hasOpenChatChannelBridge()) {
      showSnackBar({
        type: 'error',
        message: '다음버전에 반영되는 기능입니다. 곧 업데이트 됩니다.',
      });
      return;
    }

    isChatClickLockedRef.current = true;

    try {
      const existingChat = await findExistingModelMatchingChat({
        receiverId,
        entrySource: 'POST_COMMENT',
      });

      if (existingChat) {
        setIsStartingChat(true);
        try {
          const opened = await openPreparedModelMatchingChat(existingChat);
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

      const chatSheetId = 'experience-group-chat-confirm-sheet';
      const experienceGroupPresets =
        presetsData?.dataList?.filter((preset) => preset.type === 'EXPERIENCE_GROUPS') ?? [];
      const chatPreset = experienceGroupPresets.find(
        (preset) => preset.subType === 'EXPERIENCE_GROUPS_CHAT_DESIGNER',
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
                    {`${receiverName}님과\n대화를 시작하시겠어요?`}
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
                        const existingChat = await findExistingModelMatchingChat({
                          receiverId,
                          entrySource: 'POST_COMMENT',
                        });
                        const preparedChat =
                          existingChat ??
                          (await prepareModelMatchingChat({
                            receiverId,
                            entrySource: 'POST_COMMENT',
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
                            createType: 'EXPERIENCE_GROUPS_CHAT_DESIGNER',
                          });
                        }

                        const opened = await openPreparedModelMatchingChat(preparedChat);
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
      isChatClickLockedRef.current = false;
    }
  }, [
    createMongWithdraw,
    findExistingModelMatchingChat,
    isFromApp,
    isStartingChat,
    mongCurrentData?.data?.currentTotalAmount,
    openPreparedModelMatchingChat,
    presetsData?.dataList,
    prepareModelMatchingChat,
    refetchMongCurrent,
    receiverId,
    receiverName,
    showBottomSheet,
    showMongInsufficientSheet,
    showSnackBar,
  ]);

  const handleCommentFormSubmit = useCallback(
    (data: CommentFormValues, options: { onSuccess: () => void }) => {
      onSubmit(data, {
        onSuccess: () => {
          setMode('actions');
          options.onSuccess();
        },
      });
    },
    [onSubmit],
  );

  if (!shouldShowCommentForm) {
    return (
      <div className="bg-white shadow-upper px-5 py-3">
        <div className="mx-auto flex w-full max-w-[335px] items-center gap-3">
          <Button
            size="md"
            theme="white"
            className="flex-1 rounded-4 border border-border-default bg-white text-label-default hover:bg-white active:bg-white focus:bg-white"
            onClick={handleCommentClick}
          >
            일반 댓글 달기
          </Button>
          <Button size="md" className="flex-1 rounded-4" onClick={handleChatClick}>
            채팅하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white shadow-strong">
      {shouldShowFloatingChatButton && (
        <Button
          className="absolute -top-14 left-1/2 -translate-x-1/2 rounded-4 bg-label-default px-3 py-[9.5px] shadow-strong typo-body-2-medium"
          onClick={handleChatClick}
        >
          <div className="flex items-center gap-1 text-white">
            채팅하기
            <ChevronRightIcon className="size-4 fill-white" />
          </div>
        </Button>
      )}
      <div className="mx-auto max-w-[600px]">
        <CommentForm
          onSubmit={handleCommentFormSubmit}
          isReply={commentFormState.state === 'reply'}
          commentId={commentFormState.commentId}
          content={commentFormState.content}
          isPending={isPending}
          textareaRef={textareaRef}
        />
      </div>
    </div>
  );
}
