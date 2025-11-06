'use client';

import { useCallback } from 'react';

import { useParams } from 'next/navigation';

import { USER_ROLE } from '@/entities/user/constants/user-role';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useCommentFormState } from '@/features/comments/hooks/use-comment-form-state';
import type { CommentFormValues } from '@/features/comments/ui/comment-form';
import useGetExperienceGroupDetail from '@/features/posts/api/use-get-experience-group-detail';
import ExperienceGroupDetailMoreButton from '@/features/posts/ui/experience-group-detail/experience-group-detail-more-button';
import CommentFormContainer from '@/widgets/comments/ui/comment-form-container';
import ExperienceGroupCommentContainer from '@/widgets/comments/ui/experience-group-comment-container';
import { SiteHeader } from '@/widgets/header';
import ExperienceGroupDetailContainer from '@/widgets/post/ui/experience-group/experience-group-detail-container';

export default function ExperienceGroupDetailPage() {
  const { id } = useParams();

  const { user } = useAuthContext();

  const { data: response } = useGetExperienceGroupDetail(id?.toString() ?? '');
  const experienceGroupDetail = response?.data;

  const isWriter = experienceGroupDetail?.user.id === user.id;

  const { commentFormState, textareaRef, isCommentCreating, isCommentUpdating, handlers } =
    useCommentFormState({
      experienceGroupId: id?.toString() ?? '',
      receiverId: experienceGroupDetail?.user.id.toString() ?? '',
    });

  const isFormPending = isCommentCreating || isCommentUpdating;

  const handleContainerClick = useCallback(() => {
    handlers.resetCommentState();
  }, [handlers]);

  const handleCommentFormSubmit = useCallback(
    (data: CommentFormValues, options: { onSuccess: () => void }) => {
      handlers.handleCommentFormSubmit(data, options);
    },
    [handlers],
  );

  if (!id || !experienceGroupDetail) return null;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <SiteHeader
        title="협찬 신청"
        showBackButton
        rightComponent={
          isWriter && <ExperienceGroupDetailMoreButton experienceGroupId={id.toString()} />
        }
      />
      <div className="flex-1 overflow-y-auto" onClick={handleContainerClick}>
        <ExperienceGroupDetailContainer experienceGroupDetail={experienceGroupDetail}>
          <ExperienceGroupCommentContainer
            experienceGroupId={id.toString()}
            postWriterId={experienceGroupDetail.user.id}
            commentFormState={commentFormState}
            handlers={{
              ...handlers,
              handleCommentFormSubmit,
            }}
          />
        </ExperienceGroupDetailContainer>
      </div>
      <CommentFormContainer
        postId={id.toString()}
        onSubmit={handleCommentFormSubmit}
        commentFormState={commentFormState}
        isPending={isFormPending}
        textareaRef={textareaRef}
        isConsulting={false}
        isAnsweredByDesigner={experienceGroupDetail.user.role === USER_ROLE.DESIGNER}
      />
    </div>
  );
}
