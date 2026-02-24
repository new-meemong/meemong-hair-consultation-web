'use client';

import { useCallback, useEffect, useRef } from 'react';

import CommentFormContainer from '@/widgets/comments/ui/comment-form-container';
import type { CommentFormValues } from '@/features/comments/ui/comment-form';
import { EXPERIENCE_GROUP_LINK_CLICK_STORAGE_KEY } from '@/features/posts/constants/experience-group-link-click-storage-key';
import ExperienceGroupCommentContainer from '@/widgets/comments/ui/experience-group-comment-container';
import ExperienceGroupDetailContainer from '@/widgets/post/ui/experience-group/experience-group-detail-container';
import ExperienceGroupDetailMoreButton from '@/features/posts/ui/experience-group-detail/experience-group-detail-more-button';
import { SiteHeader } from '@/widgets/header';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import { getGetExperienceGroupCommentsQueryKeyPrefix } from '@/features/comments/api/use-get-experience-group-comments';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useCommentFormState } from '@/features/comments/hooks/use-comment-form-state';
import useGetExperienceGroupDetail from '@/features/posts/api/use-get-experience-group-detail';
import { useParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

type ExperienceGroupLinkClickMeta = {
  experienceGroupId: number;
  clickedAt: number;
};

const EXPERIENCE_GROUP_LINK_CLICK_META_TTL_MS = 10 * 60 * 1000;

export default function ExperienceGroupDetailPage() {
  const { id } = useParams();

  const { user, isUserDesigner } = useAuthContext();
  const queryClient = useQueryClient();
  const wasHiddenRef = useRef(false);
  const isAutoCommentPostingRef = useRef(false);

  const { data: response, refetch: refetchDetail } = useGetExperienceGroupDetail(
    id?.toString() ?? '',
  );
  const experienceGroupDetail = response?.data;

  const isWriter = experienceGroupDetail?.user.id === user.id;

  const { commentFormState, textareaRef, isCommentCreating, isCommentUpdating, handlers } =
    useCommentFormState({
      experienceGroupId: id?.toString() ?? '',
      receiverId: experienceGroupDetail?.user.id.toString() ?? '',
    });

  const isFormPending = isCommentCreating || isCommentUpdating;

  useEffect(() => {
    if (!isCommentCreating) {
      isAutoCommentPostingRef.current = false;
    }
  }, [isCommentCreating]);

  const getPendingLinkClickMeta = useCallback((): ExperienceGroupLinkClickMeta | null => {
    try {
      const raw = sessionStorage.getItem(EXPERIENCE_GROUP_LINK_CLICK_STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw) as Partial<ExperienceGroupLinkClickMeta>;
      if (typeof parsed.experienceGroupId !== 'number' || typeof parsed.clickedAt !== 'number') {
        return null;
      }

      return {
        experienceGroupId: parsed.experienceGroupId,
        clickedAt: parsed.clickedAt,
      };
    } catch {
      return null;
    }
  }, []);

  const clearPendingLinkClickMeta = useCallback(() => {
    try {
      sessionStorage.removeItem(EXPERIENCE_GROUP_LINK_CLICK_STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
  }, []);

  // 페이지가 다시 보일 때 데이터 새로고침 (링크 클릭 후 돌아올 때)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && wasHiddenRef.current) {
        // 페이지가 다시 보이고, 이전에 숨겨졌었다면 데이터 새로고침
        if (id) {
          refetchDetail();
          // 댓글 데이터도 새로고침
          queryClient.invalidateQueries({
            queryKey: [
              getGetExperienceGroupCommentsQueryKeyPrefix(),
              { experienceGroupId: id.toString() },
            ],
          });
        }

        if (id && isUserDesigner && !isAutoCommentPostingRef.current) {
          const pendingLinkClickMeta = getPendingLinkClickMeta();
          const currentExperienceGroupId = Number(id);
          const isValidTarget =
            pendingLinkClickMeta?.experienceGroupId === currentExperienceGroupId &&
            Date.now() - pendingLinkClickMeta.clickedAt <= EXPERIENCE_GROUP_LINK_CLICK_META_TTL_MS;

          if (isValidTarget) {
            isAutoCommentPostingRef.current = true;
            handlers.handleCommentFormSubmit(
              {
                content: `${user.displayName} 디자이너님이 링크를 조회했습니다.`,
                isVisibleToModel: true,
                parentCommentId: null,
              },
              {
                onSuccess: () => {
                  clearPendingLinkClickMeta();
                  isAutoCommentPostingRef.current = false;
                },
              },
            );
          } else if (
            pendingLinkClickMeta &&
            Date.now() - pendingLinkClickMeta.clickedAt > EXPERIENCE_GROUP_LINK_CLICK_META_TTL_MS
          ) {
            clearPendingLinkClickMeta();
          }
        }

        wasHiddenRef.current = false;
      } else if (document.visibilityState === 'hidden') {
        wasHiddenRef.current = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    clearPendingLinkClickMeta,
    getPendingLinkClickMeta,
    handlers,
    id,
    isUserDesigner,
    queryClient,
    refetchDetail,
    user.displayName,
  ]);

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
