import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import Image, { type StaticImageData } from 'next/image';
import { XIcon } from 'lucide-react';

import CameraIcon from '@/assets/icons/camera.svg';
import PlusIcon from '@/assets/icons/plus.svg';
import PictureIcon from '@/assets/icons/picture.svg';
import guideBodyO from '@/assets/hair-photo-guide/guide_body_o.png';
import guideBodyX from '@/assets/hair-photo-guide/guide_body_x.png';
import guideCurrentO from '@/assets/hair-photo-guide/guide_current_o.png';
import guideCurrentX from '@/assets/hair-photo-guide/guide_current_x.png';
import guideFrontO from '@/assets/hair-photo-guide/guide_front_o.png';
import guideFrontX from '@/assets/hair-photo-guide/guide_front_x.png';
import guideSideO from '@/assets/hair-photo-guide/guide_side_o.png';
import guideSideX from '@/assets/hair-photo-guide/guide_side_x.png';
import { Button } from '@/shared';
import { HAIR_CONSULTATION_FORM_FIELD_NAME } from '../../constants/hair-consultation-form-field-name';
import type { HairConsultationFormValues } from '../../types/hair-consultation-form-values';
import { IMAGE_TYPE } from '@/shared/constants/image-type';
import { MY_IMAGE_TYPE } from '@/features/posts/constants/my-image-type';
import type { ValueOf } from '@/shared/type/types';
import { AppTypography } from '@/shared/styles/typography';
import { useOverlayContext } from '@/shared/context/overlay-context';

export default function HairConsultationFormStepMyImages() {
  const { setValue, getValues, control } = useFormContext<HairConsultationFormValues>();
  const { showSnackBar } = useOverlayContext();

  const [activeGuideType, setActiveGuideType] =
    useState<ValueOf<typeof MY_IMAGE_TYPE> | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);

  const currentImages = useWatch({
    control,
    name: HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES,
  });

  type GuideConfig = {
    title: string;
    required: boolean;
    goodImage: StaticImageData;
    badImage: StaticImageData;
    descriptions: ReactNode[];
  };

  const guideConfig = useMemo<Record<ValueOf<typeof MY_IMAGE_TYPE>, GuideConfig>>(
    () => ({
      [MY_IMAGE_TYPE.FRONT]: {
        title: '정면 사진',
        required: true,
        goodImage: guideFrontO,
        badImage: guideFrontX,
        descriptions: [
          '얼굴형 파악에 꼭 필요해요',
          '너무 작은 사진은 안돼요',
        ],
      },
      [MY_IMAGE_TYPE.SIDE]: {
        title: '측면 사진',
        required: true,
        goodImage: guideSideO,
        badImage: guideSideX,
        descriptions: [
          <>
            <span className="typo-body-2-long-semibold">귀</span>가 나와야해요
          </>,
          '얼굴형 파악에 꼭 필요해요',
        ],
      },
      [MY_IMAGE_TYPE.RECENT]: {
        title: '현재 내 머리 사진',
        required: true,
        goodImage: guideCurrentO,
        badImage: guideCurrentX,
        descriptions: [
          <>
            <span className="typo-body-2-long-semibold">최근 일주일</span> 내 사진이면
            가능해요
          </>,
          <>
            반드시 <span className="typo-body-2-long-semibold">머리길이</span>가
            보여야 해요
          </>,
        ],
      },
      [MY_IMAGE_TYPE.WHOLE_BODY]: {
        title: '전신 사진',
        required: false,
        goodImage: guideBodyO,
        badImage: guideBodyX,
        descriptions: [
          '체형, 골격, 스타일을 파악하는 데 필요해요',
          <>
            <span className="typo-body-2-long-semibold">얼굴</span>이 나와야해요
          </>,
        ],
      },
    }),
    [],
  );

  const getCurrentImage = useCallback(
    (type: ValueOf<typeof MY_IMAGE_TYPE>) => {
      const currentImage = currentImages?.find(
        (img: { type: ValueOf<typeof MY_IMAGE_TYPE>; image: File }) => img.type === type,
      );

      return currentImage
        ? {
            type: IMAGE_TYPE.FILE,
            name: currentImage.image.name,
            src: URL.createObjectURL(currentImage.image),
          }
        : null;
    },
    [currentImages],
  );

  const handleImageUpload = useCallback(
    ({ file, type }: { file: File; type: ValueOf<typeof MY_IMAGE_TYPE> }) => {
      const currentImages = getValues(HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES) || [];
      const filteredImages = currentImages.filter(
        (img: { type: ValueOf<typeof MY_IMAGE_TYPE>; image: File }) => img.type !== type,
      );
      const newImage = { type, image: file };

      setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES, [...filteredImages, newImage], {
        shouldDirty: true,
      });
      showSnackBar({ type: 'success', message: '이미지가 업로드 되었습니다' });
      setActiveGuideType(null);
    },
    [getValues, setValue, showSnackBar],
  );

  const handleImageDelete = useCallback(
    ({ type }: { type: ValueOf<typeof MY_IMAGE_TYPE> }) => {
      const currentImages = getValues(HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES) || [];
      const newImages = currentImages.filter(
        (img: { type: ValueOf<typeof MY_IMAGE_TYPE>; image: File }) => img.type !== type,
      );
      setValue(HAIR_CONSULTATION_FORM_FIELD_NAME.MY_IMAGES, newImages);
    },
    [getValues, setValue],
  );

  const handleInputChange =
    (type: ValueOf<typeof MY_IMAGE_TYPE>) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      handleImageUpload({ file: e.target.files[0], type });
      e.target.value = '';
    };

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const handleCaptureClick = () => {
    captureInputRef.current?.click();
  };

  if (activeGuideType) {
    const guide = guideConfig[activeGuideType];

    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <span className={`${AppTypography.headlineSemiBold} text-label-default`}>
            {guide.title}
          </span>
          <span className="typo-body-2-semibold text-cautionary">
            {guide.required ? '필수' : '선택'}
          </span>
        </div>

        <div className="mt-7 flex items-center justify-between">
          <Image
            src={guide.goodImage}
            alt={`${guide.title} 올바른 예시`}
            width={163}
            height={163}
            className="rounded-6"
          />
          <Image
            src={guide.badImage}
            alt={`${guide.title} 잘못된 예시`}
            width={163}
            height={163}
            className="rounded-6"
          />
        </div>

        <div className="mt-3 flex flex-col text-label-sub text-center">
          {guide.descriptions.map((description, index) => (
            <p key={index} className="typo-body-2-long-regular">
              {description}
            </p>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full px-3 py-3 rounded-4 border border-border-default bg-white typo-body-2-medium text-label-sub"
            onClick={handleUploadClick}
          >
            <PictureIcon className="w-5 h-5" />
            사진 업로드
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full px-3 py-3 rounded-4 border border-border-default bg-white typo-body-2-medium text-label-sub"
            onClick={handleCaptureClick}
          >
            <CameraIcon className="w-5 h-5" />
            사진 촬영
          </button>
        </div>

        <input
          ref={uploadInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange(activeGuideType)}
        />
        <input
          ref={captureInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleInputChange(activeGuideType)}
        />
      </div>
    );
  }

  const renderUploadSlot = (type: ValueOf<typeof MY_IMAGE_TYPE>, label: string) => {
    const currentImage = getCurrentImage(type);
    return (
      <div className="flex flex-col gap-2 items-center">
        {currentImage ? (
          <div className="relative w-[120px] h-[120px] flex-shrink-0">
            <Image
              src={currentImage.src}
              alt={currentImage.name}
              fill
              className="object-cover rounded-6"
              sizes="120px"
            />
            <Button
              type="button"
              variant="icon"
              size="icon"
              className="absolute top-1 right-1 bg-label-default text-white"
              onClick={() => handleImageDelete({ type })}
            >
              <XIcon className="w-4 h-4 text-white" />
            </Button>
          </div>
        ) : (
          <button
            className="w-[120px] h-[120px] rounded-6 bg-alternative flex items-center justify-center overflow-hidden"
            onClick={() => setActiveGuideType(type)}
            type="button"
          >
            <PlusIcon className="w-7.5 h-7.5 fill-label-placeholder" />
          </button>
        )}
        <p className="typo-body-2-regular text-label-info text-center">{label}</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <p className={`${AppTypography.headlineSemiBold} text-label-default`}>
            사진을 업로드해주세요
          </p>
          <span className="typo-body-2-semibold text-cautionary">필수</span>
        </div>
        <p className={`${AppTypography.body2LongRegular} text-label-info`}>
          내 머리와 이미지가 잘 드러나는 사진을 업로드해주세요
        </p>
      </div>
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="grid grid-cols-2 gap-6">
          {renderUploadSlot(MY_IMAGE_TYPE.FRONT, '정면 (필수)')}
          {renderUploadSlot(MY_IMAGE_TYPE.SIDE, '측면 (필수)')}
        </div>
        <div className="grid grid-cols-2 gap-6">
          {renderUploadSlot(MY_IMAGE_TYPE.RECENT, '현재 내 머리 (필수)')}
          {renderUploadSlot(MY_IMAGE_TYPE.WHOLE_BODY, '전신 (선택)')}
        </div>
      </div>
    </div>
  );
}
