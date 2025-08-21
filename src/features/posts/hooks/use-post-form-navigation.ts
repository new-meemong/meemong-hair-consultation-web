import { useCallback, useEffect, useState } from 'react';

import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';
import type { ValueOf } from '@/shared/type/types';

import { POST_TAB_VALUE } from '../constants/post-tabs';
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

  const { getSavedContent, saveContent } = useWritingContent(
    USER_WRITING_CONTENT_KEYS.consultingPost,
  );

  const { back } = useRouterWithUser();

  const savedContent = getSavedContent();
  const hasSavedConsultingPost = savedContent !== null;

  const handleCloseReloadConsultingPostModal = () => {
    setSelectedTab(POST_TAB_VALUE.GENERAL);
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
    if (hasSavedConsultingPost && !initialize) {
      showReloadConsultingPostModal();
    }
    setInitialize(true);
  }, [hasSavedConsultingPost, showReloadConsultingPostModal, initialize]);

  const leaveForm = useCallback(
    (writingContent: WritingStep<ConsultingPostFormValues>, isDirty: boolean) => {
      if (selectedTab === POST_TAB_VALUE.CONSULTING) {
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

      if (selectedTab === POST_TAB_VALUE.GENERAL) {
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
    (
      tab: ValueOf<typeof POST_TAB_VALUE>,
      writingContent: WritingStep<ConsultingPostFormValues>,
    ) => {
      if (tab === POST_TAB_VALUE.GENERAL && hasSavedConsultingPost) {
        showLeaveCreateConsultingPostModal({
          onClose: () => {
            setSelectedTab(tab);
            saveContent(writingContent);
          },
        });
        return;
      }

      if (tab === POST_TAB_VALUE.CONSULTING && hasSavedConsultingPost) {
        showReloadConsultingPostModal({ onFinish: () => setSelectedTab(tab) });
        return;
      }

      setSelectedTab(tab);
    },
    [
      hasSavedConsultingPost,
      setSelectedTab,
      showLeaveCreateConsultingPostModal,
      saveContent,
      showReloadConsultingPostModal,
    ],
  );

  return { selectedTab, leaveForm, changeTab };
}
