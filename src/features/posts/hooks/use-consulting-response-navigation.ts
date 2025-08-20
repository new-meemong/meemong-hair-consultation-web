import { useCallback, useEffect, useState } from 'react';

import type { UseFormReturn } from 'react-hook-form';

import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';

import type { ConsultingResponseFormValues } from '../types/consulting-response-form-values';

import useShowLeaveCreateConsultingResponseModal from './use-show-leave-create-consulting-response-modal';
import useShowReloadConsultingResponseModal from './use-show-reload-consulting-response-modal';

export default function useConsultingResponseNavigation({
  method,
}: {
  method: UseFormReturn<ConsultingResponseFormValues>;
}) {
  const [initialize, setInitialize] = useState(false);

  const { back } = useRouterWithUser();

  const { isDirty } = method.formState;

  const { getSavedContent, saveContent } = useWritingContent(
    USER_WRITING_CONTENT_KEYS.consultingResponse,
  );

  const savedContent = getSavedContent();
  const hasSavedContent = savedContent !== null;

  const showLeaveCreateConsultingResponseModal = useShowLeaveCreateConsultingResponseModal();
  const showReloadConsultingResponseModal = useShowReloadConsultingResponseModal({
    onPositive: () => {
      if (!savedContent) return;

      method.reset(savedContent);
    },
    onNegative: () => {
      saveContent(null);
    },
  });

  const handleBackClick = useCallback(() => {
    if (savedContent || isDirty) {
      showLeaveCreateConsultingResponseModal({
        onClose: () => {
          back();
          saveContent(method.getValues());
        },
      });
      return;
    }

    back();
  }, [back, isDirty, method, saveContent, savedContent, showLeaveCreateConsultingResponseModal]);

  useEffect(() => {
    if (hasSavedContent && !initialize) {
      showReloadConsultingResponseModal();
    }
    setInitialize(true);
  }, [hasSavedContent, showReloadConsultingResponseModal, initialize]);

  return { handleBackClick };
}
