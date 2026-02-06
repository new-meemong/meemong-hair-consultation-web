import { useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';

import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import { useAuthContext } from '@/features/auth/context/auth-context';
import type { CommentFormState } from '@/features/comments/types/comment-form-state';
import { CommentForm, type CommentFormValues } from '@/features/comments/ui/comment-form';
import useWritingConsultingResponse from '@/features/posts/hooks/use-writing-consulting-response';
import { ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { detectExternalContact } from '@/shared/lib/detect-external-contact';
import useShowModal from '@/shared/ui/hooks/use-show-modal';
import { Button } from '@/shared/ui/button';

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
  postSource?: 'new' | 'legacy';
};

export default function CommentFormContainer({
  postId,
  onSubmit,
  commentFormState,
  isPending,
  textareaRef,
  isConsulting,
  isAnsweredByDesigner,
  postSource = 'legacy',
}: CommentFormContainerProps) {
  const searchParams = useSearchParams();
  const postListTab = searchParams.get(SEARCH_PARAMS.POST_LIST_TAB) ?? 'latest';

  const { push } = useRouterWithUser();
  const { isUserDesigner } = useAuthContext();
  const showModal = useShowModal();

  const isCommentFormReply = commentFormState.state === 'reply';

  const canWriteConsultingResponse =
    isConsulting && isUserDesigner && !isCommentFormReply && !isAnsweredByDesigner;

  const [commentMode, setCommentMode] = useState<'consulting' | 'normal'>(
    canWriteConsultingResponse ? 'consulting' : 'normal',
  );

  const handleNormalCommentClick = useCallback(() => {
    setCommentMode('normal');
  }, []);

  const { hasSavedContent } = useWritingConsultingResponse(postId);

  const writingResponseButtonText = hasSavedContent ? '이어서 작성하기' : '컨설팅 답변하기';

  const handleWriteConsultingResponseClick = () => {
    const path =
      postSource === 'new'
        ? ROUTES.POSTS_NEW_CREATE_CONSULTING_POST(postId.toString())
        : ROUTES.POSTS_CREATE_CONSULTING_POST(postId.toString());

    push(path, {
      [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
    });
  };

  const handleCommentFormSubmit = useCallback(
    (data: CommentFormValues, options: { onSuccess: () => void }) => {
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
    [isUserDesigner, isConsulting, commentMode, isCommentFormReply, showModal, onSubmit],
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
      {canWriteConsultingResponse && commentMode === 'consulting' ? (
        <div className="bg-white shadow-upper px-5 py-3 flex gap-3 justify-evenly">
          <Button size="md" theme="white" className="flex-1" onClick={handleNormalCommentClick}>
            일반 댓글 달기
          </Button>
          <Button size="md" className="flex-1" onClick={handleWriteConsultingResponseClick}>
            {writingResponseButtonText}
          </Button>
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
