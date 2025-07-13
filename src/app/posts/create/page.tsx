'use client';

import GalleryIcon from '@/assets/icons/gallery.svg';
import { useCreatePost } from '@/features/posts/ui/use-create-post';
import { useNavigation } from '@/shared';
import useGuidePopup, { USER_GUIDE_KEYS } from '@/shared/hooks/use-guide-popup';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { Button, Checkbox, Input, Label, Separator, Textarea } from '@/shared/ui';
import { SiteHeader } from '@/widgets/header';
import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from 'lucide-react';
import Image from 'next/image';
import React, { useRef } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const MAX_IMAGE_COUNT = 10;

const FORM_FIELD_NAME = {
  title: 'title',
  content: 'content',
  isPhotoVisibleToDesigner: 'isPhotoVisibleToDesigner',
  images: 'images',
} as const;

const formSchema = z.object({
  [FORM_FIELD_NAME.title]: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(100, '제목은 100자 이하로 입력해주세요'),
  [FORM_FIELD_NAME.content]: z
    .string()
    .min(1, '내용을 입력해주세요')
    .max(1000, '내용은 1000자 이하로 입력해주세요'),
  [FORM_FIELD_NAME.isPhotoVisibleToDesigner]: z.boolean(),
  [FORM_FIELD_NAME.images]: z
    .array(z.instanceof(File))
    .max(10, '이미지는 최대 10개까지 업로드할 수 있습니다'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePostPage() {
  const { guideElement } = useGuidePopup(USER_GUIDE_KEYS.hasSeenWritePostGuide);
  const { replace } = useRouterWithUser();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleCreatePost, isPending } = useCreatePost();
  const navigation = useNavigation();

  const method = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      [FORM_FIELD_NAME.title]: '',
      [FORM_FIELD_NAME.content]: '',
      [FORM_FIELD_NAME.isPhotoVisibleToDesigner]: false,
      [FORM_FIELD_NAME.images]: [],
    },
  });

  const images = useWatch({
    control: method.control,
    name: FORM_FIELD_NAME.images,
  });

  const isValid = method.formState.isValid;
  const isLoading = method.formState.isSubmitting || isPending;

  const submit = (data: FormValues) => {
    console.log('data', data);
    handleCreatePost(data, {
      onSuccess: () => {
        replace('/posts');
      },
    });
  };

  const validateImageCount = (count: number) => {
    if (count >= MAX_IMAGE_COUNT) {
      method.setError(FORM_FIELD_NAME.images, {
        message: `이미지는 최대 ${MAX_IMAGE_COUNT}개까지 업로드할 수 있습니다`,
      });
      return false;
    }
    return true;
  };

  const handleImageUploadClick = () => {
    method.clearErrors(FORM_FIELD_NAME.images);

    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    if (!validateImageCount(images.length + e.target.files.length - 1)) return;

    const newFiles = Array.from(e.target.files);
    const updatedImages = [...images, ...newFiles];
    method.setValue(FORM_FIELD_NAME.images, updatedImages);
  };

  const handleImageDelete = (index: number) => {
    method.clearErrors(FORM_FIELD_NAME.images);

    const newImages = images.filter((_, i) => i !== index);
    method.setValue(FORM_FIELD_NAME.images, newImages);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <FormProvider {...method}>
        <form onSubmit={method.handleSubmit(submit)} className="flex flex-col flex-1">
          <SiteHeader
            title="게시글 작성"
            showBackButton
            onBackClick={() => navigation.toPosts()}
            rightComponent={
              <button
                type="submit"
                disabled={!isValid}
                className={`typo-body-2-semibold ${isValid ? 'text-positive' : 'text-label-placeholder'}`}
              >
                {isLoading ? '등록 중...' : '등록'}
              </button>
            }
          />
          <div className="flex flex-col flex-1 gap-5 py-6 px-5">
            <div>
              <Input
                {...method.register(FORM_FIELD_NAME.title)}
                placeholder="제목을 입력하세요"
                className="w-full px-0 py-3 typo-title-3-semibold text-label-default placeholder:text-label-placeholder"
              />
              {method.formState.errors[FORM_FIELD_NAME.title] && (
                <p className="text-negative typo-body-3-regular mt-1">
                  {String(method.formState.errors[FORM_FIELD_NAME.title]?.message)}
                </p>
              )}
              <Separator className="w-full bg-border-default h-0.25" />
            </div>
            <div className="flex-1 flex flex-col">
              <Textarea
                {...method.register(FORM_FIELD_NAME.content)}
                placeholder="내 헤어 고민을 자유롭게 작성해보세요"
                className="w-full flex-1 typo-body-1-long-regular resize-none placeholder:text-label-placeholder overflow-y-auto"
              />
              {method.formState.errors[FORM_FIELD_NAME.content] && (
                <p className="text-negative typo-body-3-regular mt-1">
                  {String(method.formState.errors[FORM_FIELD_NAME.content]?.message)}
                </p>
              )}
            </div>
          </div>
          {images.length > 0 && (
            <>
              <>
                <Separator className="w-full bg-border-default h-0.25" />
                <div className="overflow-x-auto py-4">
                  <div className="flex gap-2 px-5 overflow-x-auto">
                    {images.map((file, index) => (
                      <div key={index} className="relative w-25 h-25 flex-shrink-0">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`업로드 이미지 ${index + 1}`}
                          fill
                          className="object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="icon"
                          size="icon"
                          className="absolute top-1 right-1"
                          onClick={() => {
                            handleImageDelete(index);
                          }}
                        >
                          <XIcon />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {method.formState.errors[FORM_FIELD_NAME.images] && (
                    <p className="text-negative typo-body-3-regular pt-5 px-5">
                      {String(method.formState.errors[FORM_FIELD_NAME.images]?.message)}
                    </p>
                  )}
                </div>
              </>
            </>
          )}
          <Separator className="w-full h-0.25 bg-border-default" />
          <div className="flex items-center px-5 py-3">
            <div className="flex flex-1 items-center">
              <Controller
                control={method.control}
                name={FORM_FIELD_NAME.isPhotoVisibleToDesigner}
                render={({ field: { onChange, value } }) => (
                  <Checkbox id="photo-visible" checked={value} onCheckedChange={onChange} />
                )}
              />
              <Label htmlFor="photo-visible" className="ml-2 typo-body-3-regular">
                디자이너에게만 공개할게요
              </Label>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <Button type="button" variant="icon" size="iconLg" onClick={handleImageUploadClick}>
              <GalleryIcon />
            </Button>
          </div>
        </form>
        {guideElement}
      </FormProvider>
    </div>
  );
}
