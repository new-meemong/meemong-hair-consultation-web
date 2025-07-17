import { Button } from '@/shared';
import type { ValueOf } from '@/shared/type/types';
import { XIcon } from 'lucide-react';
import Image from 'next/image';

type ImageListProps = {
  imageFiles: File[];
  imageUrls: string[];
  setImageFiles: (newImageFiles: File[]) => void;
  setImageUrls: (newImageUrls: string[]) => void;
};

const IMAGE_TYPE = {
  FILE: 'file',
  URL: 'url',
} as const;

type ImageItem = {
  type: ValueOf<typeof IMAGE_TYPE>;
  name: string;
  src: string;
};

const getImages = (imageFiles: File[], imageUrls: string[]): ImageItem[] => {
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

  const handleImageDelete = (image: ImageItem) => {
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
        <div
          key={`${image.type}-${image.src}-${index}`}
          className="relative w-25 h-25 flex-shrink-0"
        >
          <Image
            src={image.src}
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
              handleImageDelete(image);
            }}
          >
            <XIcon />
          </Button>
        </div>
      ))}
    </div>
  );
}
