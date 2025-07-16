import { Button } from '@/shared';
import { XIcon } from 'lucide-react';
import Image from 'next/image';

type ImageListProps = {
  images: File[] | string[];
  onImageDelete: (index: number) => void;
};

function getImageUrl(image: File | string) {
  if (typeof image === 'string') return image;
  return URL.createObjectURL(image);
}

export default function ImageList({ images, onImageDelete }: ImageListProps) {
  return (
    <div className="flex gap-2 px-5 overflow-x-auto">
      {images.map((image, index) => (
        <div key={index} className="relative w-25 h-25 flex-shrink-0">
          <Image
            src={getImageUrl(image)}
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
              onImageDelete(index);
            }}
          >
            <XIcon />
          </Button>
        </div>
      ))}
    </div>
  );
}
