import { IMAGE_TYPE } from '../constants/image-type';

import type { Image } from './image-form-item';
import ImageFormItem from './image-form-item';
import ImageUploaderItem from './image-uploader-item';

type ImageUploaderListProps = {
  images: File[];
  onUpload: (file: File) => void;
  onDelete: (index: number) => void;
  maxImageCount: number;
};

export default function ImageUploaderList({
  images,
  onUpload,
  onDelete,
  maxImageCount,
}: ImageUploaderListProps) {
  const canUpload = images.length < maxImageCount;

  const getCurrentImage = (image: File): Image => {
    return {
      type: IMAGE_TYPE.FILE,
      name: image.name,
      src: URL.createObjectURL(image),
    };
  };

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {canUpload && <ImageUploaderItem onUpload={onUpload} currentImage={null} />}
      {images.map((image, index) => (
        <ImageFormItem
          key={`${image.name}-${index}`}
          image={getCurrentImage(image)}
          handleImageDelete={() => onDelete(index)}
        />
      ))}
    </div>
  );
}
