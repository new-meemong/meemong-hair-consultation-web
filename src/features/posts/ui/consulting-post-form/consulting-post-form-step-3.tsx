import PlusIcon from '@/assets/icons/plus.svg';
import { Button } from '@/shared';
import useShowConsultingPostImageGuideSheet from '../../hooks/use-show-consulting-post-image-guide-sheet';
import useShowModal from '@/shared/ui/hooks/use-show-modal';
import { useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CONSULTING_POST_FORM_FIELD_NAME } from '../../constants/consulting-post-form-field-name';
import {
  CONSULTING_POST_FORM_IMAGE_POSITION,
  type ConsultingPostFormValues,
} from '../../types/consulting-post-form-values';
import ImageUploader, { type ImageUploaderRef } from '@/shared/ui/image-uploader';
import ImageItem, { type Image } from '@/shared/ui/image-item';
import { IMAGE_TYPE } from '@/shared/constants/image-type';
import type { ValueOf } from '@/shared/type/types';

type ImageUploaderProps = {
  onUpload: (file: File) => void;
  label: string;
  currentImage: Image | null;
  onDelete: (image: Image) => void;
};

function ImageUploaderItem({ onUpload, label, currentImage, onDelete }: ImageUploaderProps) {
  const showModal = useShowModal();
  const imageUploaderRef = useRef<ImageUploaderRef>(null);

  const handleClick = () => {
    showModal({
      id: 'consulting-post-image-upload-modal',
      text: '사진 업로드 수단을\n선택해주세요',
      buttons: [
        {
          label: '갤러리에서 선택하기',
          onClick: () => {
            imageUploaderRef.current?.triggerFileSelect();
          },
        },
        {
          label: '새로 촬영하기',
          onClick: () => {
            console.log('카메라로 촬영하기');
          },
        },
        {
          label: '닫기',
          onClick: () => {
            console.log('취소');
          },
        },
      ],
    });
  };

  const handleImageUpload = (file: File) => {
    onUpload(file);
  };

  const handleImageDelete = (image: Image) => {
    onDelete(image);
  };

  return (
    <div className="flex flex-col gap-2">
      {currentImage ? (
        <ImageItem image={currentImage} index={0} handleImageDelete={handleImageDelete} />
      ) : (
        <button
          className="w-25 h-25 rounded-6 bg-alternative flex items-center justify-center overflow-hidden"
          onClick={handleClick}
          type="button"
        >
          <PlusIcon className="w-7.5 h-7.5 fill-label-placeholder" />
        </button>
      )}
      <p className="typo-body-2-regular text-label-info text-center">{label}</p>
      <ImageUploader ref={imageUploaderRef} setImages={handleImageUpload} multiple={false} />
    </div>
  );
}

export default function ConsultingPostFormStep3() {
  const { setValue, getValues, control } = useFormContext<ConsultingPostFormValues>();

  const showConsultingPostImageGuideSheet = useShowConsultingPostImageGuideSheet();
  const handleGuideClick = () => {
    showConsultingPostImageGuideSheet();
  };

  const currentImages = useWatch({
    control,
    name: CONSULTING_POST_FORM_FIELD_NAME.option3,
  });

  const getCurrentImage = (position: string) => {
    const currentImage = currentImages?.find(
      (img: { position: string; image: File }) => img.position === position,
    );

    return currentImage
      ? {
          type: IMAGE_TYPE.FILE,
          name: currentImage.image.name,
          src: URL.createObjectURL(currentImage.image),
        }
      : null;
  };

  const handleImageUpload = ({
    file,
    position,
  }: {
    file: File;
    position: ValueOf<typeof CONSULTING_POST_FORM_IMAGE_POSITION>;
  }) => {
    const currentImages = getValues(CONSULTING_POST_FORM_FIELD_NAME.option3) || [];
    const newImage = { position, image: file };

    setValue(CONSULTING_POST_FORM_FIELD_NAME.option3, [...currentImages, newImage]);
  };

  const handleImageDelete = ({
    position,
  }: {
    position: ValueOf<typeof CONSULTING_POST_FORM_IMAGE_POSITION>;
  }) => {
    const currentImages = getValues(CONSULTING_POST_FORM_FIELD_NAME.option3) || [];
    const newImages = currentImages.filter(
      (img: { position: string; image: File }) => img.position !== position,
    );
    setValue(CONSULTING_POST_FORM_FIELD_NAME.option3, newImages);
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="grid grid-cols-2 gap-6">
          <ImageUploaderItem
            currentImage={getCurrentImage(CONSULTING_POST_FORM_IMAGE_POSITION.FRONT)}
            onUpload={(file) =>
              handleImageUpload({ file, position: CONSULTING_POST_FORM_IMAGE_POSITION.FRONT })
            }
            onDelete={() =>
              handleImageDelete({ position: CONSULTING_POST_FORM_IMAGE_POSITION.FRONT })
            }
            label="푼머리 정면"
          />
          <ImageUploaderItem
            currentImage={getCurrentImage(CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_FRONT)}
            onUpload={(file) =>
              handleImageUpload({
                file,
                position: CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_FRONT,
              })
            }
            onDelete={() =>
              handleImageDelete({ position: CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_FRONT })
            }
            label="묶은 머리 정면"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <ImageUploaderItem
            currentImage={getCurrentImage(CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_SIDE)}
            onUpload={(file) =>
              handleImageUpload({
                file,
                position: CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_SIDE,
              })
            }
            label="묶은 머리 측면"
            onDelete={() =>
              handleImageDelete({ position: CONSULTING_POST_FORM_IMAGE_POSITION.PONYTAIL_SIDE })
            }
          />
          <ImageUploaderItem
            currentImage={getCurrentImage(CONSULTING_POST_FORM_IMAGE_POSITION.WHOLE) || null}
            onUpload={(file) =>
              handleImageUpload({ file, position: CONSULTING_POST_FORM_IMAGE_POSITION.WHOLE })
            }
            onDelete={() =>
              handleImageDelete({ position: CONSULTING_POST_FORM_IMAGE_POSITION.WHOLE })
            }
            label="상반신 전체"
          />
        </div>
      </div>
      <Button theme="white" onClick={handleGuideClick}>
        사진 가이드 확인
      </Button>
    </div>
  );
}
