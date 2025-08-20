import { useCallback, useEffect, useState } from 'react';

import type { UseFormReturn } from 'react-hook-form';

import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';
import type { ValueOf } from '@/shared/type/types';

import { POST_TAB_VALUE } from '../constants/post-tabs';
import type { ConsultingPostFormValues } from '../types/consulting-post-form-values';

import { usePostTab } from './use-post-tab';
import useShowLeaveCreateConsultingPostModal from './use-show-leave-create-consulting-post';
import useShowLeaveCreateGeneralPostModal from './use-show-leave-create-general-post-modal';
import useShowReloadConsultingPostModal from './use-show-reload-consulting-post-modal';

export default function usePostFormNavigation({
  method,
}: {
  method: UseFormReturn<ConsultingPostFormValues>;
}) {
  const [initialize, setInitialize] = useState(false);

  const [selectedTab, setSelectedTab] = usePostTab();

  const { isDirty } = method.formState;

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
    onPositive: () => {
      if (!savedContent) return;

      method.reset(savedContent);
    },
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

  const handleBackClick = useCallback(() => {
    if (selectedTab === POST_TAB_VALUE.CONSULTING) {
      if (savedContent || isDirty) {
        showLeaveCreateConsultingPostModal({
          onClose: () => {
            back();
            saveContent(method.getValues());
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
  }, [
    selectedTab,
    back,
    savedContent,
    isDirty,
    method,
    showLeaveCreateConsultingPostModal,
    saveContent,
    showLeaveCreateGeneralPostModal,
  ]);

  const handleTabChange = useCallback(
    (tab: ValueOf<typeof POST_TAB_VALUE>) => {
      if (tab === POST_TAB_VALUE.GENERAL && hasSavedConsultingPost) {
        showLeaveCreateConsultingPostModal({
          onClose: () => {
            setSelectedTab(tab);
            saveContent(method.getValues());
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
      method,
      showReloadConsultingPostModal,
    ],
  );

  return { selectedTab, handleBackClick, handleTabChange };
}
