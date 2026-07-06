import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useFormContext, useWatch } from 'react-hook-form';

import FormItem from '@/shared/ui/form-item';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import ImageUploaderList from '@/shared/ui/image-uploader-list';
import { Textarea } from '@/shared';
import { requestImagePreviewPaint } from '@/shared/lib/request-image-preview-paint';
import { resizeImageFile } from '@/shared/lib/resize-image-file';

const MAX_IMAGE_COUNT = 3;
const RESIZE_MAX_SIZE = 1024;

export default function HairConsultationFormStepAspirationImages() {
  const { setValue, control, register, getValues } = useFormContext<HairConsultationFormValues>();
  const aspirationDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const [isAspirationDescriptionFocused, setIsAspirationDescriptionFocused] = useState(false);

  const aspirationDescriptionField = register(
    `${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.description`,
  );

  const watchedImages = useWatch({
    name: `${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.images`,
    control,
  });

  const currentImages = useMemo(() => watchedImages ?? [], [watchedImages]);

  const replaceAspirationImagesWithResizedFiles = useCallback(
    async (files: File[]) => {
      try {
        const resizeResults = await Promise.allSettled(
          files.map(async (file) => [file, await resizeImageFile(file, RESIZE_MAX_SIZE)] as const),
        );
        const resizedFileEntries: Array<readonly [File, File]> = [];

        resizeResults.forEach((result) => {
          if (result.status !== 'fulfilled') return;

          const [file, resizedFile] = result.value;
          if (resizedFile !== file) {
            resizedFileEntries.push([file, resizedFile]);
          }
        });

        const resizedFileMap = new Map(resizedFileEntries);
        if (resizedFileMap.size === 0) return;

        const currentValue = getValues(HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES);
        const currentImageFiles = currentValue?.images ?? [];
        const nextImageFiles = currentImageFiles.map((file) => resizedFileMap.get(file) ?? file);
        const didReplace = nextImageFiles.some((file, index) => file !== currentImageFiles[index]);
        if (!didReplace) return;

        setValue(
          HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES,
          {
            images: nextImageFiles,
            resizedImages: nextImageFiles,
            description: currentValue?.description ?? '',
          },
          { shouldDirty: true },
        );
        requestImagePreviewPaint();
      } catch {
        // Keep the original preview files if background resizing fails.
      }
    },
    [getValues, setValue],
  );

  const handleImageUpload = useCallback(
    (files: File[]) => {
      const currentValue = getValues(HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES);
      const currentImageFiles = currentValue?.images ?? currentImages;
      const newImages = [...currentImageFiles, ...files];

      flushSync(() => {
        setValue(
          HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES,
          {
            images: newImages,
            resizedImages: [],
            description: currentValue?.description ?? '',
          },
          { shouldDirty: true },
        );
      });
      requestImagePreviewPaint(() => {
        void replaceAspirationImagesWithResizedFiles(files);
      });
    },
    [currentImages, setValue, getValues, replaceAspirationImagesWithResizedFiles],
  );

  const setImageFiles = useCallback(
    (newImageFiles: File[]) => {
      const currentDescription = getValues(
        `${HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES}.description`,
      );

      setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.ASPIRATION_IMAGES, {
        images: newImageFiles,
        resizedImages: [],
        description: currentDescription,
      });
    },
    [setValue, getValues],
  );

  const scrollAspirationDescriptionIntoView = useCallback(() => {
    aspirationDescriptionRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);

  const handleAspirationDescriptionFocus = useCallback(() => {
    setIsAspirationDescriptionFocused(true);
    requestAnimationFrame(() => {
      scrollAspirationDescriptionIntoView();
      setTimeout(() => scrollAspirationDescriptionIntoView(), 200);
      setTimeout(() => scrollAspirationDescriptionIntoView(), 450);
    });
  }, [scrollAspirationDescriptionIntoView]);

  useEffect(() => {
    if (!isAspirationDescriptionFocused) return;

    const handleResize = () => {
      scrollAspirationDescriptionIntoView();
    };

    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, [isAspirationDescriptionFocused, scrollAspirationDescriptionIntoView]);

  return (
    <div className="flex flex-col gap-7">
      <FormItem label="이미지" description="원하는 머리 사진을 업로드해주세요 (최대 3개)">
        <ImageUploaderList
          imageFiles={currentImages}
          onUpload={handleImageUpload}
          setImageFiles={setImageFiles}
          maxImageCount={MAX_IMAGE_COUNT}
        />
      </FormItem>
      <FormItem label="상세 설명">
        <Textarea
          {...aspirationDescriptionField}
          ref={(node) => {
            aspirationDescriptionField.ref(node);
            aspirationDescriptionRef.current = node;
          }}
          placeholder="추구하는 스타일에 대해 구체적으로 설명해주세요"
          className="min-h-38 typo-body-2-long-regular"
          hasBorder
          onFocus={handleAspirationDescriptionFocus}
          onBlur={(e) => {
            setIsAspirationDescriptionFocused(false);
            aspirationDescriptionField.onBlur(e);
          }}
        />
      </FormItem>
    </div>
  );
}
