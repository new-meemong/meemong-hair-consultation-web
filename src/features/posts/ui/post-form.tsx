'use client';

import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import { CREATE_POST_FORM_MAX_COUNT } from '@/features/posts/constants/create-post-form';
import { Button, Input, Label, Separator, Textarea } from '@/shared';
import ControlledCheckbox from '@/shared/ui/controlled-checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import useShowImageUploadLimitSheet from '../hooks/use-show-image-upload-limit-sheet';
import ImageUploader from './image-uploader';
import PostFormImageList from './post-form-image-list';

export const POST_FORM_FIELD_NAME = {
  title: 'title',
  content: 'content',
  isPhotoVisibleToDesigner: 'isPhotoVisibleToDesigner',
  imageFiles: 'imageFiles',
  imageUrls: 'imageUrls',
} as const;

const formSchema = z.object({
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

const DEFAULT_VALUES = {
  [POST_FORM_FIELD_NAME.title]: '',
  [POST_FORM_FIELD_NAME.content]: '',
  [POST_FORM_FIELD_NAME.isPhotoVisibleToDesigner]: false,
  [POST_FORM_FIELD_NAME.imageFiles]: [] as File[],
  [POST_FORM_FIELD_NAME.imageUrls]: [] as string[],
} as const;

type PostFormProps = {
  initialData?: PostFormValues;
  onSubmit: (data: PostFormValues) => void;
  isPending?: boolean;
};

export default function PostForm({ initialData, onSubmit, isPending }: PostFormProps) {
  const method = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: initialData ?? DEFAULT_VALUES,
  });

  const [imageFiles, imageUrls] = useWatch({
    control: method.control,
    name: [POST_FORM_FIELD_NAME.imageFiles, POST_FORM_FIELD_NAME.imageUrls],
  });

  const isValid = method.formState.isValid;
  const isDirty = method.formState.isDirty;
  const isLoading = method.formState.isSubmitting || isPending;

  const hasImages = imageFiles.length > 0 || imageUrls.length > 0;

  const setImageFiles = (newImageFiles: File[]) => {
    method.setValue(POST_FORM_FIELD_NAME.imageFiles, newImageFiles);
  };

  const setImageUrls = (newImageUrls: string[]) => {
    method.setValue(POST_FORM_FIELD_NAME.imageUrls, newImageUrls);
  };

  const showImageUploadLimitSheet = useShowImageUploadLimitSheet();

  const validateImageCount = (newImageLength?: number) => {
    const currentImageCount = imageFiles.length + imageUrls.length;
    const newImageCount = newImageLength ? newImageLength - 1 : 0;

    const count = currentImageCount + newImageCount;

    if (count >= CREATE_POST_FORM_MAX_COUNT.IMAGE) {
      showImageUploadLimitSheet();
      return false;
    }
    return true;
  };

  const addImageFiles = (newImageFiles: File[]) => {
    const updatedImageFiles = [...imageFiles, ...newImageFiles];

    method.setValue(POST_FORM_FIELD_NAME.imageFiles, updatedImageFiles);
  };

  return (
    <FormProvider {...method}>
      <form onSubmit={method.handleSubmit(onSubmit)} className="flex flex-col flex-1">
        <div className="flex flex-col flex-1 gap-5 py-6 px-5">
          <div>
            <Input
              {...method.register(POST_FORM_FIELD_NAME.title)}
              placeholder="제목을 입력하세요"
              className="w-full px-0 py-3 typo-title-3-semibold text-label-default placeholder:text-label-placeholder"
            />
            {method.formState.errors[POST_FORM_FIELD_NAME.title] && (
              <p className="text-negative typo-body-3-regular mt-1">
                {String(method.formState.errors[POST_FORM_FIELD_NAME.title]?.message)}
              </p>
            )}
            <Separator />
          </div>
          <div className="flex-1 flex flex-col">
            <Textarea
              {...method.register(POST_FORM_FIELD_NAME.content)}
              placeholder="내 헤어 고민을 자유롭게 작성해보세요"
              className="w-full flex-1 typo-body-1-long-regular resize-none placeholder:text-label-placeholder overflow-y-auto"
            />
            {method.formState.errors[POST_FORM_FIELD_NAME.content] && (
              <p className="text-negative typo-body-3-regular mt-1">
                {String(method.formState.errors[POST_FORM_FIELD_NAME.content]?.message)}
              </p>
            )}
          </div>
        </div>
        {hasImages && (
          <>
            <Separator />
            <div className="overflow-x-auto py-4">
              <PostFormImageList
                imageFiles={imageFiles}
                imageUrls={imageUrls}
                setImageFiles={setImageFiles}
                setImageUrls={setImageUrls}
              />
            </div>
          </>
        )}
        <Separator />
        <div className="flex items-center px-5 py-3">
          <div className="flex flex-1 items-center">
            <ControlledCheckbox name={POST_FORM_FIELD_NAME.isPhotoVisibleToDesigner} />
            <Label
              htmlFor={POST_FORM_FIELD_NAME.isPhotoVisibleToDesigner}
              className="ml-2 typo-body-3-regular"
            >
              디자이너에게만 공개할게요
            </Label>
          </div>
          <div className="flex gap-2">
            <ImageUploader setImages={addImageFiles} validate={validateImageCount} />
            <Button
              variant="textWithIcon"
              size="textWithIcon"
              disabled={!isValid || isLoading || !isDirty}
              type="submit"
            >
              저장
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
