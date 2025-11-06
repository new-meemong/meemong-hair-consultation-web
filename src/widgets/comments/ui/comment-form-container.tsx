import { useCallback, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import { useAuthContext } from '@/features/auth/context/auth-context';
import type { CommentFormState } from '@/features/comments/types/comment-form-state';
import { CommentForm, type CommentFormValues } from '@/features/comments/ui/comment-form';
import useWritingConsultingResponse from '@/features/posts/hooks/use-writing-consulting-response';
import { ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
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
};

export default function CommentFormContainer({
  postId,
  onSubmit,
  commentFormState,
  isPending,
  textareaRef,
  isConsulting,
  isAnsweredByDesigner,
}: CommentFormContainerProps) {
  const searchParams = useSearchParams();
  const postListTab = searchParams.get(SEARCH_PARAMS.POST_LIST_TAB) ?? 'latest';

  const { push } = useRouterWithUser();
  const { isUserDesigner } = useAuthContext();

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
    push(ROUTES.POSTS_CREATE_CONSULTING_POST(postId.toString()), {
      [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
    });
  };

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
              onSubmit={onSubmit}
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
