'use client';

import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import { CREATE_POST_FORM_MAX_COUNT } from '@/features/posts/constants/create-post-form';
import { Button, Input, Label, Separator, Textarea } from '@/shared';
import ControlledCheckbox from '@/shared/ui/controlled-checkbox';
import { FormProvider, useWatch } from 'react-hook-form';
import { POST_FORM_FIELD_NAME } from '../constants/post-form-field-name';
import usePostForm from '../hooks/use-post-form';
import useShowImageUploadLimitSheet from '../hooks/use-show-image-upload-limit-sheet';
import type { PostFormValues } from '../types/post-form-values';
import ImageUploader from './image-uploader';
import PostFormImageList from './post-form-image-list';

type PostFormProps = {
  initialData?: PostFormValues;
  onSubmit: (data: PostFormValues) => void;
  isPending?: boolean;
};

export default function PostForm({ initialData, onSubmit, isPending }: PostFormProps) {
  const method = usePostForm(initialData);

  const [imageFiles, imageUrls] = useWatch({
    control: method.control,
    name: [POST_FORM_FIELD_NAME.imageFiles, POST_FORM_FIELD_NAME.imageUrls],
  });

  const { isValid, isDirty, isSubmitting } = method.formState;
  const isLoading = isSubmitting || isPending;

  const hasImages = imageFiles.length > 0 || imageUrls.length > 0;

  const setImageFiles = (newImageFiles: File[]) => {
    method.setValue(POST_FORM_FIELD_NAME.imageFiles, newImageFiles, { shouldDirty: true });
  };

  const setImageUrls = (newImageUrls: string[]) => {
    method.setValue(POST_FORM_FIELD_NAME.imageUrls, newImageUrls, { shouldDirty: true });
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

    method.setValue(POST_FORM_FIELD_NAME.imageFiles, updatedImageFiles, { shouldDirty: true });
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
