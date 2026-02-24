import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

const TEXT = {
  [USER_WRITING_CONTENT_KEYS.consultingPost]: '컨설팅이',
  [USER_WRITING_CONTENT_KEYS.hairConsultation]: '신규 상담지가',
  [USER_WRITING_CONTENT_KEYS.experienceGroup]: '체험단 신청이',
};

export default function useShowReloadSavedPostFormModal({
  onClose,
  onPositive,
  onNegative,
  type,
}: {
  onClose: () => void;
  onPositive: () => void;
  onNegative: () => void;
  type:
    | typeof USER_WRITING_CONTENT_KEYS.consultingPost
    | typeof USER_WRITING_CONTENT_KEYS.hairConsultation
    | typeof USER_WRITING_CONTENT_KEYS.experienceGroup;
}) {
  const showModal = useShowModal();

  const showReloadConsultingPostModal = ({
    onFinish,
  }: {
    onFinish?: () => void;
  } = {}) => {
    showModal({
      id: 'reload-consulting-post-modal',
      text: `작성중인 ${TEXT[type]} 있습니다.\n이어서 작성하시겠습니까?`,
      buttons: [
        {
          label: '이어서 작성하기',
          textColor: 'text-positive',
          onClick: () => {
            onPositive();
            onFinish?.();
          },
        },
        {
          label: '처음부터 작성하기',
          onClick: () => {
            onNegative();
            onFinish?.();
          },
        },
        {
          label: '닫기',
          onClick: onClose,
        },
      ],
    });
  };

  return showReloadConsultingPostModal;
}
