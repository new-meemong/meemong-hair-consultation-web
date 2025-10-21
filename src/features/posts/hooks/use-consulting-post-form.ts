import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { ROUTES } from '@/shared';
import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import { useOverlayContext } from '@/shared/context/overlay-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useWritingContent from '@/shared/hooks/use-writing-content';

import { CONSULTING_POST_FORM_FIELD_NAME } from '../constants/consulting-post-form-field-name';
import { HAIR_CONCERN_OPTION_VALUE } from '../constants/hair-concern-option';
import {
  consultingPostFormSchema,
  type ConsultingPostFormValues,
} from '../types/consulting-post-form-values';

import { useCreateConsultingPost } from './use-create-consulting-post';

const DEFAULT_FORM_VALUE = {
  [CONSULTING_POST_FORM_FIELD_NAME.CONCERN]: {
    value: HAIR_CONCERN_OPTION_VALUE.ETC,
    additional: '',
  },
  [CONSULTING_POST_FORM_FIELD_NAME.TREATMENTS]: [],
  [CONSULTING_POST_FORM_FIELD_NAME.MY_IMAGES]: [],
  [CONSULTING_POST_FORM_FIELD_NAME.ASPIRATION_IMAGES]: {
    images: [],
    description: '',
  },
  [CONSULTING_POST_FORM_FIELD_NAME.SKIN_TONE]: null,
  [CONSULTING_POST_FORM_FIELD_NAME.CONTENT]: '',
  [CONSULTING_POST_FORM_FIELD_NAME.TITLE]: '',
};

export default function useConsultingPostForm() {
  const { replace } = useRouterWithUser();
  const { showSnackBar } = useOverlayContext();

  const { saveContent } = useWritingContent(USER_WRITING_CONTENT_KEYS.consultingPost);

  const method = useForm<ConsultingPostFormValues>({
    resolver: zodResolver(consultingPostFormSchema),
    defaultValues: DEFAULT_FORM_VALUE,
  });

  const { handleCreateConsultingPost } = useCreateConsultingPost();

  const submit = (values: ConsultingPostFormValues) => {
    handleCreateConsultingPost(values, {
      onSuccess: () => {
        saveContent(null);
        showSnackBar({
          type: 'success',
          message: '업로드가 완료되었습니다!',
        });
        replace(ROUTES.POSTS);
      },
    });
  };

  return { method, submit };
}
