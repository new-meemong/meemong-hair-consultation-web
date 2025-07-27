import { IMAGE_TYPE } from '@/shared/constants/image-type';
import type { Image } from '@/shared/ui/image-item';
import ImageItem from '@/shared/ui/image-item';

type ImageListProps = {
  imageFiles: File[];
  imageUrls: string[];
  setImageFiles: (newImageFiles: File[]) => void;
  setImageUrls: (newImageUrls: string[]) => void;
};

const getImages = (imageFiles: File[], imageUrls: string[]): Image[] => {
  const convertedImageFiles = imageFiles.map((file) => ({
    type: IMAGE_TYPE.FILE,
    name: file.name,
    src: URL.createObjectURL(file),
  }));

  const convertedImageUrls = imageUrls.map((url) => ({
    type: IMAGE_TYPE.URL,
    name: url,
    src: url,
  }));

  return [...convertedImageUrls, ...convertedImageFiles];
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
        <ImageItem
          key={`${image.type}-${image.src}-${index}`}
          image={image}
          index={index}
          handleImageDelete={handleImageDelete}
        />
      ))}
    </div>
  );
}
