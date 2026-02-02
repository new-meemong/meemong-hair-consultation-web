import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

const TEXT = {
  [USER_WRITING_CONTENT_KEYS.consultingPost]: '컨설팅 글 작성',
  [USER_WRITING_CONTENT_KEYS.hairConsultation]: '신규 상담지 작성',
  [USER_WRITING_CONTENT_KEYS.experienceGroup]: '체험단 신청',
};

export default function useShowLeaveCreatePostModal({
  type,
}: {
  type:
    | typeof USER_WRITING_CONTENT_KEYS.consultingPost
    | typeof USER_WRITING_CONTENT_KEYS.hairConsultation
    | typeof USER_WRITING_CONTENT_KEYS.experienceGroup;
}) {
  const showModal = useShowModal();

  const showLeaveCreateConsultingPostModal = ({ onClose }: { onClose: () => void }) => {
    showModal({
      id: 'leave-create-consulting-post-modal',
      text: `${TEXT[type]}을 그만두시겠습니까?\n작성 중인 내용은 자동 저장되며\n이어서 작성할 수 있습니다.`,
      buttons: [
        {
          label: '나가기',
          textColor: 'text-negative',
          onClick: () => {
            onClose();
          },
        },
        {
          label: '취소',
        },
      ],
    });
  };

  return showLeaveCreateConsultingPostModal;
}
