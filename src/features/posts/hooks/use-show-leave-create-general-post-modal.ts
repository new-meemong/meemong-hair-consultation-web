import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

export default function useShowLeaveCreateGeneralPostModal() {
  const showModal = useShowModal();
  const { back } = useRouterWithUser();

  const showLeaveCreateGeneralPostModal = () => {
    showModal({
      id: 'leave-create-general-post-modal',
      text: '글 작성을 그만두시겠습니까?\n일반 상담 글은 저장되지 않습니다.',
      buttons: [
        {
          label: '나가기',
          textColor: 'text-negative',
          onClick: () => {
            back();
          },
        },
        {
          label: '취소',
        },
      ],
    });
  };

  return showLeaveCreateGeneralPostModal;
}
