import { useCallback, useEffect, useState } from 'react';

import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';
import type { KeyOf } from '@/shared/type/types';


import useShowLeaveCreatePostModal from './use-show-leave-create-post-modal';
import useShowReloadSavedPostFormModal from './use-show-reload-saved-post-form-modal';
import type { UserWritingContent } from '../types/user-writing-content';

export default function usePostFormNavigation<
  T extends Exclude<KeyOf<UserWritingContent>, 'consultingResponse'>,
>({
  type,
  onSavedContentReload,
}: {
  onSavedContentReload: (savedContent: UserWritingContent[T]) => void;
  type: T;
}) {
  const [initialize, setInitialize] = useState(false);

  const { savedContent, saveContent } = useWritingContent(type);
  const hasSavedContent = savedContent !== null && savedContent !== undefined;

  const { back } = useRouterWithUser();

  const showReloadSavedPostFormModal = useShowReloadSavedPostFormModal({
    onClose: back,
    onPositive: () => onSavedContentReload(savedContent),
    onNegative: () => {
      saveContent(null);
    },
    type,
  });
  const showLeaveCreatePostModal = useShowLeaveCreatePostModal({ type });

  useEffect(() => {
    if (hasSavedContent && !initialize) {
      showReloadSavedPostFormModal();
    }
    setInitialize(true);
  }, [showReloadSavedPostFormModal, initialize, hasSavedContent]);

  const leaveForm = useCallback(
    (writingContent: UserWritingContent[T], isDirty: boolean) => {
      if (savedContent || isDirty) {
        showLeaveCreatePostModal({
          onClose: () => {
            back();
            saveContent(writingContent);
          },
        });
        return;
      }

      back();
    },
    [back, savedContent, showLeaveCreatePostModal, saveContent],
  );

  return { leaveForm };
}
