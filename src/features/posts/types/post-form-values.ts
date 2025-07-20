import z from 'zod';
import { POST_FORM_FIELD_NAME } from '../constants/post-form-field-name';
import { CREATE_POST_FORM_MAX_COUNT } from '../constants/create-post-form';

export const formSchema = z.object({
  [POST_FORM_FIELD_NAME.title]: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(
      CREATE_POST_FORM_MAX_COUNT.TITLE,
      `제목은 ${CREATE_POST_FORM_MAX_COUNT.TITLE}자 이하로 입력해주세요`,
    ),
  [POST_FORM_FIELD_NAME.content]: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(
      CREATE_POST_FORM_MAX_COUNT.CONTENT,
      `내용은 ${CREATE_POST_FORM_MAX_COUNT.CONTENT}자 이하로 입력해주세요`,
    ),
  [POST_FORM_FIELD_NAME.isPhotoVisibleToDesigner]: z.boolean(),
  [POST_FORM_FIELD_NAME.imageFiles]: z
    .array(z.instanceof(File))
    .max(
      CREATE_POST_FORM_MAX_COUNT.IMAGE,
      `이미지는 최대 ${CREATE_POST_FORM_MAX_COUNT.IMAGE}개까지 업로드할 수 있습니다`,
    ),
  [POST_FORM_FIELD_NAME.imageUrls]: z.array(z.string()),
});

export type PostFormValues = z.infer<typeof formSchema>;
