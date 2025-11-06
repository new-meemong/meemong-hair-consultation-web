import { ROUTES } from '@/shared';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

import usePatchExperienceGroupMutation from '../api/use-patch-experience-group-mutation';
import type { ExperienceGroupFormValues } from '../types/experience-group-form-values';

export default function useEditExperienceGroup({
  experienceGroupId,
}: {
  experienceGroupId: string;
}) {
  const showModal = useShowModal();
  const { replace } = useRouterWithUser();

  const { mutate: editExperienceGroup } = usePatchExperienceGroupMutation({
    experienceGroupId,
  });

  const handleEdit = (values: ExperienceGroupFormValues) => {
    editExperienceGroup(values, {
      onSuccess: () => {
        showModal({
          id: 'edit-consulting-response-confirm-modal',
          text: '수정이 완료되었습니다',
          buttons: [
            {
              label: '확인',
              onClick: () => {
                replace(ROUTES.POSTS_EXPERIENCE_GROUP_DETAIL(experienceGroupId));
              },
            },
          ],
        });
      },
    });
  };

  return { handleEdit };
}
