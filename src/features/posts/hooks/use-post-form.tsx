import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { POST_FORM_FIELD_NAME } from '../constants/post-form-field-name';
import { formSchema, type PostFormValues } from '../types/post-form-values';

const DEFAULT_VALUES = {
  [POST_FORM_FIELD_NAME.title]: '',
  [POST_FORM_FIELD_NAME.content]: '',
  [POST_FORM_FIELD_NAME.isPhotoVisibleToDesigner]: false,
  [POST_FORM_FIELD_NAME.imageFiles]: [] as File[],
  [POST_FORM_FIELD_NAME.imageUrls]: [] as string[],
} as const;

export default function usePostForm(initialData?: PostFormValues) {
  const method = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: initialData ?? DEFAULT_VALUES,
  });

  return method;
}
