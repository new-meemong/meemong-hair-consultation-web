import { useCallback, useMemo } from 'react';

import type { CommentActionHandlers } from '@/entities/comment/model/comment-action-handlers';
import type { CommentFormState } from '@/features/comments/types/comment-form-state';
import { CommentList } from '@/features/comments/ui/comment-list';
import convertToCommentWithReplyStatusFromHairConsultationAnswer from '@/entities/comment/lib/convertToCommentWithReplyStatusFromHairConsultationAnswer';
import convertToCommentWithReplyStatusFromHairConsultationComment from '@/entities/comment/lib/convertToCommentWithReplyStatusFromHairConsultationComment';
import useDeleteHairConsultationAnswerMutation from '@/features/posts/api/use-delete-hair-consultation-answer-mutation';
import useGetHairConsultationAnswers from '@/features/posts/api/use-get-hair-consultation-answers';
import useGetHairConsultationComments from '@/features/comments/api/use-get-hair-consultation-comments';
import { usePostDetail } from '@/features/posts/context/post-detail-context';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

type HairConsultationCommentContainerProps = {
  hairConsultationId: string;
  commentFormState: CommentFormState;
  handlers: CommentActionHandlers;
};

export default function HairConsultationCommentContainer({
  hairConsultationId,
  commentFormState,
  handlers,
}: HairConsultationCommentContainerProps) {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetHairConsultationComments(hairConsultationId);
  const { data: answersData } = useGetHairConsultationAnswers(hairConsultationId, {
    __limit: 100,
  });

  const comments = convertToCommentWithReplyStatusFromHairConsultationComment(data);
  const answers = convertToCommentWithReplyStatusFromHairConsultationAnswer(answersData);

  const normalizedAnswers = useMemo(() => {
    const profileImageByUserId = new Map<number, string>();

    comments.forEach((comment) => {
      if (comment.user.profilePictureURL) {
        profileImageByUserId.set(comment.user.userId, comment.user.profilePictureURL);
      }
    });

    return answers.map((answer) => {
      const normalizedProfileImage =
        profileImageByUserId.get(answer.user.userId) ?? answer.user.profilePictureURL;

      if (normalizedProfileImage === answer.user.profilePictureURL) {
        return answer;
      }

      return {
        ...answer,
        user: {
          ...answer.user,
          profilePictureURL: normalizedProfileImage,
        },
      };
    });
  }, [answers, comments]);

  const groupedComments = useMemo(() => {
    const groups: (typeof comments)[] = [];
    let currentGroup: typeof comments = [];

    comments.forEach((comment) => {
      if (!comment.isReply) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }
        currentGroup = [comment];
        return;
      }

      if (currentGroup.length === 0) {
        currentGroup = [comment];
        return;
      }

      currentGroup.push(comment);
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [comments]);

  const mergedComments = useMemo(() => {
    const items: Array<{
      sortTarget: (typeof comments)[number];
      group: (typeof comments)[number][];
    }> = [
      ...groupedComments.map((group) => ({ sortTarget: group[0], group })),
      ...normalizedAnswers.map((answer) => ({ sortTarget: answer, group: [answer] })),
    ];

    items.sort((a, b) => {
      const timeDiff =
        new Date(b.sortTarget.createdAt).getTime() - new Date(a.sortTarget.createdAt).getTime();
      if (!Number.isNaN(timeDiff) && timeDiff !== 0) return timeDiff;
      return b.sortTarget.id - a.sortTarget.id;
    });

    return items.flatMap((item) => item.group);
  }, [groupedComments, normalizedAnswers]);

  const { postDetail } = usePostDetail();
  const { mutate: deleteHairConsultationAnswerMutate } = useDeleteHairConsultationAnswerMutation();
  const showModal = useShowModal();

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDelete = useCallback(
    (commentId: number) => {
      const targetComment = mergedComments.find((comment) => comment.id === commentId);

      if (targetComment?.isConsultingAnswer && targetComment.answerId) {
        showModal({
          id: 'delete-answer-confirm-modal',
          text: '해당 답변을 삭제하시겠습니까?',
          buttons: [
            {
              label: '삭제',
              onClick: () => {
                deleteHairConsultationAnswerMutate(
                  {
                    hairConsultationId,
                    hairConsultationsAnswerId: targetComment.answerId as number,
                  },
                  { onSuccess: () => {} },
                );
              },
            },
            {
              label: '취소',
            },
          ],
        });
        return;
      }

      handlers.handleDeleteComment(commentId);
    },
    [mergedComments, showModal, deleteHairConsultationAnswerMutate, hairConsultationId, handlers],
  );

  return (
    <CommentList
      comments={mergedComments}
      postId={postDetail.id.toString()}
      postWriterId={postDetail.hairConsultPostingCreateUserId}
      postWriterSex={postDetail.hairConsultPostingCreateUserSex}
      fetchNextPage={handleFetchNextPage}
      onReplyClick={handlers.handleReplyClick}
      focusedCommentId={commentFormState.commentId}
      onDelete={handleDelete}
      onEdit={(commentId) => handlers.handleEditComment(commentId, mergedComments)}
      onReport={() => {}}
      onTriggerClick={handlers.resetCommentState}
    />
  );
}
