import { useCallback, useEffect, useState } from 'react';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';
import type { ValueOf } from '@/shared/type/types';

import type { ConsultingPostFormValues } from '../types/consulting-post-form-values';
import type { WritingStep } from '../types/user-writing-content';

import { usePostTab } from './use-post-tab';
import useShowLeaveCreateConsultingPostModal from './use-show-leave-create-consulting-post';
import useShowLeaveCreateGeneralPostModal from './use-show-leave-create-general-post-modal';
import useShowReloadConsultingPostModal from './use-show-reload-consulting-post-modal';

export default function usePostFormNavigation({
  onSavedContentReload,
}: {
  onSavedContentReload: (savedContent: WritingStep<ConsultingPostFormValues>) => void;
}) {
  const [initialize, setInitialize] = useState(false);

  const [selectedTab, setSelectedTab] = usePostTab();

  const { savedContent, saveContent, hasSavedContent } = useWritingContent(
    USER_WRITING_CONTENT_KEYS.consultingPost,
  );

  const { back } = useRouterWithUser();

  const handleCloseReloadConsultingPostModal = () => {
    setSelectedTab(CONSULT_TYPE.GENERAL);
  };

  const showReloadConsultingPostModal = useShowReloadConsultingPostModal({
    onClose: handleCloseReloadConsultingPostModal,
    onPositive: () => onSavedContentReload(savedContent),
    onNegative: () => {
      saveContent(null);
    },
  });
  const showLeaveCreateConsultingPostModal = useShowLeaveCreateConsultingPostModal();
  const showLeaveCreateGeneralPostModal = useShowLeaveCreateGeneralPostModal();

  useEffect(() => {
    if (hasSavedContent && !initialize) {
      showReloadConsultingPostModal();
    }
    setInitialize(true);
  }, [showReloadConsultingPostModal, initialize, hasSavedContent]);

  const leaveForm = useCallback(
    (writingContent: WritingStep<ConsultingPostFormValues>, isDirty: boolean) => {
      if (selectedTab === CONSULT_TYPE.CONSULTING) {
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
        return;
      }

      if (selectedTab === CONSULT_TYPE.GENERAL) {
        showLeaveCreateGeneralPostModal();
        return;
      }

      back();
    },
    [
      selectedTab,
      back,
      savedContent,
      showLeaveCreateConsultingPostModal,
      saveContent,
      showLeaveCreateGeneralPostModal,
    ],
  );

  const changeTab = useCallback(
    (tab: ValueOf<typeof CONSULT_TYPE>, writingContent: WritingStep<ConsultingPostFormValues>) => {
      if (tab === CONSULT_TYPE.GENERAL && hasSavedContent) {
        showLeaveCreateConsultingPostModal({
          onClose: () => {
            setSelectedTab(tab);
            saveContent(writingContent);
          },
        });
        return;
      }

      if (tab === CONSULT_TYPE.CONSULTING && hasSavedContent) {
        showReloadConsultingPostModal({ onFinish: () => setSelectedTab(tab) });
        return;
      }

      setSelectedTab(tab);
    },
    [
      hasSavedContent,
      setSelectedTab,
      showLeaveCreateConsultingPostModal,
      saveContent,
      showReloadConsultingPostModal,
    ],
  );

  return { selectedTab, leaveForm, changeTab };
}
