import { IMAGE_TYPE } from '../constants/image-type';
import { getImages } from '../lib/get-images';

import ImageFormItem, { type Image } from './image-form-item';
import ImageUploaderItem from './image-uploader-item';

type ImageUploaderListProps = {
  imageFiles: File[];
  imageUrls?: string[];
  onUpload: (file: File) => void;
  setImageUrls?: (newImageUrls: string[]) => void;
  setImageFiles: (newImageFiles: File[]) => void;
  maxImageCount: number;
};

export default function ImageUploaderList({
  imageFiles,
  imageUrls = [],
  onUpload,
  setImageUrls,
  setImageFiles,
  maxImageCount,
}: ImageUploaderListProps) {
  const images = getImages(imageFiles, imageUrls);

  const canUpload = images.length < maxImageCount;

  const handleImageDelete = (image: Image) => {
    if (image.type === IMAGE_TYPE.URL) {
      const newImageUrls = imageUrls.filter((url) => url !== image.src);
      setImageUrls?.(newImageUrls);
    } else {
      const newImageFiles = imageFiles.filter((file) => file.name !== image.name);
      setImageFiles(newImageFiles);
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {canUpload && <ImageUploaderItem onUpload={onUpload} currentImage={null} />}
      {images.map((image, index) => (
        <ImageFormItem
          key={`${image.name}-${index}`}
          image={image}
          handleImageDelete={handleImageDelete}
        />
      ))}
    </div>
  );
}
