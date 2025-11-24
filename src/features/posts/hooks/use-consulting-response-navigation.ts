import { useCallback, useEffect, useState } from 'react';

import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';


import useShowLeaveCreateConsultingResponseModal from './use-show-leave-create-consulting-response-modal';
import useShowReloadConsultingResponseModal from './use-show-reload-consulting-response-modal';
import useWritingConsultingResponse from './use-writing-consulting-response';
import type { ConsultingResponseFormValues } from '../types/consulting-response-form-values';
import type { WritingStep } from '../types/user-writing-content';

export default function useConsultingResponseNavigation({
  postId,
  onSavedContentReload,
}: {
  postId: string;
  onSavedContentReload: (savedContent: WritingStep<ConsultingResponseFormValues>[]) => void;
}) {
  const [initialize, setInitialize] = useState(false);

  const { back } = useRouterWithUser();

  const { savedContent, saveContent, hasSavedContent } = useWritingConsultingResponse(postId);

  const showLeaveCreateConsultingResponseModal = useShowLeaveCreateConsultingResponseModal();
  const showReloadConsultingResponseModal = useShowReloadConsultingResponseModal({
    onPositive: () => onSavedContentReload(savedContent),
    onNegative: () => {
      const filteredContent = savedContent?.filter((content) => content?.content.postId !== postId);

      saveContent(filteredContent ?? []);
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
            const savedItem = savedContent?.find((item) => item?.content.postId === postId);

            if (savedItem) {
              saveContent(
                savedContent?.map((item) =>
                  item?.content.postId === postId ? writingContent : item,
                ),
              );
            } else {
              saveContent([...(savedContent ?? []), writingContent]);
            }
          },
        });
        return;
      }

      back();
    },
    [back, postId, saveContent, savedContent, showLeaveCreateConsultingResponseModal],
  );

  useEffect(() => {
    if (hasSavedContent && !initialize) {
      showReloadConsultingResponseModal();
    }
    setInitialize(true);
  }, [hasSavedContent, showReloadConsultingResponseModal, initialize]);

  return { leaveForm, hasSavedContent };
}
