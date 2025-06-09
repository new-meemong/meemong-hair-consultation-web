'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { SiteHeader } from '@/widgets/header';
import { Textarea, Input, Checkbox, Label, Separator, Button } from '@/shared/ui';
import { CheckedState } from '@radix-ui/react-checkbox';
import { XIcon } from 'lucide-react';
import GalleryIcon from '@/assets/icons/gallery.svg';

// TODO : 폼 별도 파일로 분리
const formSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요').max(100, '제목은 100자 이하로 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요').max(1000, '내용은 1000자 이하로 입력해주세요'),
  isPhotoVisibleToDesigner: z.boolean(),
  images: z.array(z.string()).max(10, '이미지는 최대 10개까지 업로드할 수 있습니다'),
});

type FormData = z.infer<typeof formSchema>;

export default function CreatePostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
      isPhotoVisibleToDesigner: true,
      images: [],
    } as FormData,
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      // TODO: 헤어 상담 게시글 제출 로직 추가
      console.log('게시글 제출:', value);
      // 성공 시 posts 목록으로 이동
      // router.push('/posts');
    },
  });

  const SubmitButton = () => {
    return (
      <form.Subscribe selector={(state) => [state.isSubmitting, state.values]}>
        {([isSubmitting, values]) => {
          const formValues = values as FormData;
          const isValid = formSchema.safeParse(formValues).success && !isSubmitting;

          return (
            <button
              onClick={() => form.handleSubmit()}
              disabled={!isValid}
              className={`typo-body-2-semibold ${isValid ? 'text-positive' : 'text-label-placeholder'}`}
            >
              {isSubmitting ? '등록 중...' : '등록'}
            </button>
          );
        }}
      </form.Subscribe>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader
        title="게시글 작성"
        showBackButton
        onBackClick={() => router.back()}
        rightComponent={<SubmitButton />}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col flex-1"
      >
        <div className="px-5 pt-6">
          <form.Field name="title">
            {(field) => (
              <div>
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="제목을 입력하세요"
                  className="w-full px-0 py-3 typo-title-3-semibold text-label-default placeholder:text-label-placeholder"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-negative typo-body-3-regular mt-1">
                    {String(field.state.meta.errors[0]?.message)}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <Separator className="w-full bg-border-default h-0.25" />
        </div>

        <div className="px-5 pt-5 flex-1 flex flex-col">
          <form.Field name="content">
            {(field) => (
              <div className="flex-1 flex flex-col">
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="내 헤어 고민을 자유롭게 작성해보세요"
                  className="w-full flex-1 typo-body-1-long-regular resize-none placeholder:text-label-placeholder overflow-y-auto"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-negative typo-body-3-regular mt-1">
                    {String(field.state.meta.errors[0]?.message)}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="images">
          {(field) => (
            <>
              {field.state.value.length > 0 && (
                <>
                  <Separator className="w-full bg-border-default h-0.25" />
                  <div className="pl-5 py-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {field.state.value.map((src, index) => (
                        <div key={index} className="relative w-25 h-25 flex-shrink-0">
                          <Image
                            src={src}
                            alt={`업로드 이미지 ${index + 1}`}
                            fill
                            className="object-cover rounded-md"
                          />
                          <Button
                            variant="icon"
                            size="icon"
                            className="absolute top-1 right-1"
                            onClick={() => {
                              const newImages = field.state.value.filter((_, i) => i !== index);
                              field.handleChange(newImages);
                            }}
                          >
                            <XIcon />
                          </Button>
                        </div>
                      ))}
                    </div>
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-negative typo-body-3-regular mt-1">
                        {String(field.state.meta.errors[0]?.message)}
                      </p>
                    )}
                  </div>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const newImageUrls = Array.from(e.target.files).map((file) =>
                      URL.createObjectURL(file),
                    );
                    const updatedImages = [...field.state.value, ...newImageUrls];
                    field.handleChange(updatedImages);
                  }
                }}
              />
            </>
          )}
        </form.Field>

        <div className="mt-auto">
          <Separator className="w-full h-0.25 bg-border-default" />

          <div className="flex items-center px-5 py-3">
            <div className="flex flex-1 items-center">
              <form.Field name="isPhotoVisibleToDesigner">
                {(field) => (
                  <>
                    <Checkbox
                      id="photo-visible"
                      checked={field.state.value as CheckedState}
                      onCheckedChange={(checked) => field.handleChange(!!checked)}
                    />
                    <Label htmlFor="photo-visible" className="ml-2 typo-body-3-regular">
                      디자이너에게만 공개할게요
                    </Label>
                  </>
                )}
              </form.Field>
            </div>

            <Button
              type="button"
              variant="icon"
              size="iconLg"
              onClick={() => fileInputRef.current?.click()}
            >
              <GalleryIcon />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
