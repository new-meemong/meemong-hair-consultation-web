import { IMAGE_TYPE } from '@/shared/constants/image-type';
import { getImages } from '@/shared/lib/get-images';
import type { Image } from '@/shared/ui/image-form-item';
import ImageFormItem from '@/shared/ui/image-form-item';

type ImageListProps = {
  imageFiles: File[];
  imageUrls: string[];
  setImageFiles: (newImageFiles: File[]) => void;
  setImageUrls: (newImageUrls: string[]) => void;
};

export default function PostFormImageList({
  imageFiles,
  imageUrls,
  setImageFiles,
  setImageUrls,
}: ImageListProps) {
  const images = getImages(imageFiles, imageUrls);

  const handleImageDelete = (image: Image) => {
    if (image.type === IMAGE_TYPE.URL) {
      const newImageUrls = imageUrls.filter((url) => url !== image.src);
      setImageUrls(newImageUrls);
    } else {
      const newImageFiles = imageFiles.filter((file) => file.name !== image.name);
      setImageFiles(newImageFiles);
    }
  };

  return (
    <div className="flex gap-2 px-5 overflow-x-auto">
      {images.map((image, index) => (
        <ImageFormItem
          key={`${image.type}-${image.src}-${index}`}
          image={image}
          handleImageDelete={handleImageDelete}
        />
      ))}
    </div>
  );
}
