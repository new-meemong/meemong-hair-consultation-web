import { useRef } from 'react';
import type { Image } from './image-form-item';
import type { ImageUploaderRef } from './image-uploader';
import ImageFormItem from './image-form-item';
import PlusIcon from '@/assets/icons/plus.svg';
import ImageUploader from './image-uploader';

type ImageUploaderProps = {
  onUpload: (file: File) => void;
  label?: string;
  currentImage: Image | null;
  onDelete?: (image: Image) => void;
};

export default function ImageUploaderItem({
  onUpload,
  label,
  currentImage,
  onDelete,
}: ImageUploaderProps) {
  const imageUploaderRef = useRef<ImageUploaderRef>(null);

  const handleClick = () => {
    imageUploaderRef.current?.triggerFileSelect();
  };

  const handleImageUpload = (file: File) => {
    onUpload(file);
  };

  return (
    <div className="flex flex-col gap-2">
      {currentImage && onDelete ? (
        <ImageFormItem image={currentImage} handleImageDelete={onDelete} />
      ) : (
        <button
          className="w-25 h-25 rounded-6 bg-alternative flex items-center justify-center overflow-hidden"
          onClick={handleClick}
          type="button"
        >
          <PlusIcon className="w-7.5 h-7.5 fill-label-placeholder" />
        </button>
      )}
      {label && <p className="typo-body-2-regular text-label-info text-center">{label}</p>}
      <ImageUploader ref={imageUploaderRef} setImages={handleImageUpload} multiple={false} />
    </div>
  );
}
