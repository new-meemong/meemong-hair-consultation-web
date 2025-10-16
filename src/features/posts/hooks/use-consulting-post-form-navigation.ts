import { useCallback, useEffect, useState } from 'react';

import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';

import type { ConsultingPostFormValues } from '../types/consulting-post-form-values';
import type { WritingStep } from '../types/user-writing-content';

import useShowLeaveCreateConsultingPostModal from './use-show-leave-create-consulting-post';
import useShowReloadConsultingPostModal from './use-show-reload-consulting-post-modal';

export default function usePostFormNavigation({
  onSavedContentReload,
}: {
  onSavedContentReload: (savedContent: WritingStep<ConsultingPostFormValues>) => void;
}) {
  const [initialize, setInitialize] = useState(false);

  const { savedContent, saveContent } = useWritingContent(USER_WRITING_CONTENT_KEYS.consultingPost);
  const hasSavedContent = savedContent !== null;

  const { back } = useRouterWithUser();

  const showReloadConsultingPostModal = useShowReloadConsultingPostModal({
    onClose: back,
    onPositive: () => onSavedContentReload(savedContent),
    onNegative: () => {
      saveContent(null);
    },
  });
  const showLeaveCreateConsultingPostModal = useShowLeaveCreateConsultingPostModal();

  useEffect(() => {
    if (hasSavedContent && !initialize ) {
      showReloadConsultingPostModal();
    }
    setInitialize(true);
  }, [showReloadConsultingPostModal, initialize, hasSavedContent]);

  const leaveForm = useCallback(
    (writingContent: WritingStep<ConsultingPostFormValues>, isDirty: boolean) => {
      if (savedContent || isDirty) {
        showLeaveCreateConsultingPostModal({
          onClose: () => {
            back();
            saveContent(writingContent);
          },
        });
        return;
      }

      back();

    },
    [back, savedContent, showLeaveCreateConsultingPostModal, saveContent],
  );


  return { leaveForm };
}
