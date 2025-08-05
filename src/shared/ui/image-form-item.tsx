import { Button } from '@/shared';
import type { ValueOf } from '@/shared/type/types';
import Image from 'next/image';
import { XIcon } from 'lucide-react';
import type { IMAGE_TYPE } from '@/shared/constants/image-type';

export type Image = {
  type: ValueOf<typeof IMAGE_TYPE>;
  name: string;
  src: string;
};

type ImageFormItemProps = {
  image: Image;
  handleImageDelete: (image: Image) => void;
};

export default function ImageFormItem({ image, handleImageDelete }: ImageFormItemProps) {
  return (
    <div className="relative w-25 h-25 flex-shrink-0">
      <Image
        src={image.src}
        alt={`업로드 이미지 ${image.name}`}
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
  );
}
