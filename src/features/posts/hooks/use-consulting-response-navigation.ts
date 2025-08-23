import { useCallback, useEffect, useState } from 'react';

import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';

import type { ConsultingResponseFormValues } from '../types/consulting-response-form-values';
import type { WritingStep } from '../types/user-writing-content';

import useShowLeaveCreateConsultingResponseModal from './use-show-leave-create-consulting-response-modal';
import useShowReloadConsultingResponseModal from './use-show-reload-consulting-response-modal';

export default function useConsultingResponseNavigation({
  onSavedContentReload,
}: {
  onSavedContentReload: (savedContent: WritingStep<ConsultingResponseFormValues>) => void;
}) {
  const [initialize, setInitialize] = useState(false);

  const { back } = useRouterWithUser();

  const { savedContent, saveContent, hasSavedContent } = useWritingContent(
    USER_WRITING_CONTENT_KEYS.consultingResponse,
  );

  const showLeaveCreateConsultingResponseModal = useShowLeaveCreateConsultingResponseModal();
  const showReloadConsultingResponseModal = useShowReloadConsultingResponseModal({
    onPositive: () => onSavedContentReload(savedContent),
    onNegative: () => {
      saveContent(null);
    },
  });

  const leaveForm = useCallback(
    (
      writingContent: WritingStep<ConsultingResponseFormValues>,
      { askingSave }: { askingSave: boolean },
    ) => {
      if (askingSave) {
        showLeaveCreateConsultingResponseModal({
          onClose: () => {
            back();
            saveContent(writingContent);
          },
        });
        return;
      }

      back();
    },
    [back, saveContent, showLeaveCreateConsultingResponseModal],
  );

  useEffect(() => {
    if (hasSavedContent && !initialize) {
      showReloadConsultingResponseModal();
    }
    setInitialize(true);
  }, [hasSavedContent, showReloadConsultingResponseModal, initialize]);

  return { leaveForm, hasSavedContent };
}
