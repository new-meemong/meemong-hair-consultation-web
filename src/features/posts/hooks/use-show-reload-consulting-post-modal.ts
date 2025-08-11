import useShowModal from '@/shared/ui/hooks/use-show-modal';

export default function useShowReloadConsultingPostModal({ onClose }: { onClose: () => void }) {
  const showModal = useShowModal();

  const showReloadConsultingPostModal = ({ onFinish }: { onFinish?: () => void } = {}) => {
    showModal({
      id: 'reload-consulting-post-modal',
      text: '작성중인 컨설팅 글이 있습니다.\n이어서 작성하시겠습니까?',
      buttons: [
        {
          label: '이어서 작성하기',
          textColor: 'text-positive',
          onClick: () => {
            //TODO: 작성하던 데이터 불러오기
            onFinish?.();
          },
        },
        {
          label: '처음부터 작성하기',
          onClick: () => {
            //TODO: 작성하던 데이터 초기화
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
