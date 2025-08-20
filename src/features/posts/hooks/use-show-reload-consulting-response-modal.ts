import useShowModal from '@/shared/ui/hooks/use-show-modal';

export default function useShowReloadConsultingResponseModal({
  onPositive,
  onNegative,
}: {
  onPositive: () => void;
  onNegative: () => void;
}) {
  const showModal = useShowModal();

  const showReloadConsultingResponseModal = () => {
    showModal({
      id: 'reload-consulting-response-modal',
      text: '작성중인 답변이 있습니다.\n이어서 작성하시겠습니까?',
      buttons: [
        {
          label: '처음부터 작성하기',
          onClick: () => {
            onNegative();
          },
        },
        {
          label: '이어서 작성하기',
          onClick: () => {
            onPositive();
          },
        },
      ],
    });
  };

  return showReloadConsultingResponseModal;
}
