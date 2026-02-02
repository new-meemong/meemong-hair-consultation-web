import { useCallback, useEffect, useState } from 'react';

import type { KeyOf } from '@/shared/type/types';
import type { UserWritingContent } from '../types/user-writing-content';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowLeaveCreatePostModal from './use-show-leave-create-post-modal';
import useShowReloadSavedPostFormModal from './use-show-reload-saved-post-form-modal';
import useWritingContent from '@/shared/hooks/use-writing-content';

export default function usePostFormNavigation<
  T extends Exclude<KeyOf<UserWritingContent>, 'consultingResponse'>,
>({
  type,
  onSavedContentReload,
  skipReload = false,
}: {
  onSavedContentReload: (savedContent: UserWritingContent[T]) => void;
  type: T;
  skipReload?: boolean;
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
      if (skipReload) {
        onSavedContentReload(savedContent);
        setInitialize(true);
        return;
      }
      showReloadSavedPostFormModal();
    }
    setInitialize(true);
  }, [showReloadSavedPostFormModal, initialize, hasSavedContent, skipReload, onSavedContentReload, savedContent]);

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
