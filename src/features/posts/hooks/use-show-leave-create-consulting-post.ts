import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

export default function useShowLeaveCreateConsultingPostModal() {
  const showModal = useShowModal();
  const { back } = useRouterWithUser();

  const showLeaveCreateConsultingPostModal = () => {
    showModal({
      id: 'leave-create-consulting-post-modal',
      text: '컨설팅 글 작성을 그만두시겠습니까?\n작성 중인 내용은 자동 저장되며\n이어서 작성할 수 있습니다.',
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

  return showLeaveCreateConsultingPostModal;
}
