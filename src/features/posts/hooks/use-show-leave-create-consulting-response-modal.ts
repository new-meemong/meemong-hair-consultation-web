import useShowModal from '@/shared/ui/hooks/use-show-modal';

export default function useShowLeaveCreateConsultingResponseModal() {
  const showModal = useShowModal();

  const showLeaveCreateConsultingResponseModal = ({ onClose }: { onClose: () => void }) => {
    showModal({
      id: 'leave-create-consulting-response-modal',
      text: '작성 중인 답변은\n자동 저장됩니다. 나가시겠어요?',
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

  return showLeaveCreateConsultingResponseModal;
}
