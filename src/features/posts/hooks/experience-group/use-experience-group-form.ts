import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';


import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import { ROUTES } from '@/shared';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';

import useCreateExperienceGroupMutation from '../../api/use-create-experience-group-mutation';
import { EXPERIENCE_GROUP_FORM_FIELD_NAME } from '../../constants/experience-group/experience-group-form-field-name';
import {
  experienceGroupFormSchema,
  type ExperienceGroupFormValues,
} from '../../types/experience-group-form-values';

const DEFAULT_FORM_VALUE = {
  [EXPERIENCE_GROUP_FORM_FIELD_NAME.TITLE]: '',
  [EXPERIENCE_GROUP_FORM_FIELD_NAME.CONTENT]: '',
  [EXPERIENCE_GROUP_FORM_FIELD_NAME.SNS_TYPES]: [],
};

export default function useExperienceGroupForm() {
  const { replace } = useRouterWithUser();
  const { showSnackBar } = useOverlayContext();

  const { saveContent } = useWritingContent(USER_WRITING_CONTENT_KEYS.experienceGroup);

  const method = useForm<ExperienceGroupFormValues>({
    resolver: zodResolver(experienceGroupFormSchema),
    defaultValues: DEFAULT_FORM_VALUE,
  });

  const { mutate } = useCreateExperienceGroupMutation();

  const submit = (values: ExperienceGroupFormValues) => {
    mutate(values, {
      onSuccess: () => {
        saveContent(null);
        showSnackBar({
          type: 'success',
          message: '업로드가 완료되었습니다!',
        });
        replace(ROUTES.POSTS, {
          [SEARCH_PARAMS.POST_TAB]: CONSULT_TYPE.EXPERIENCE_GROUP,
        });
      },
    });
  };

  return { method, submit };
}
