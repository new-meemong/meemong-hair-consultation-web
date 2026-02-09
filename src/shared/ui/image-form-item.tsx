import { XIcon } from 'lucide-react';
import Image from 'next/image';


import { Button } from '@/shared';
import type { IMAGE_TYPE } from '@/shared/constants/image-type';
import type { ValueOf } from '@/shared/type/types';


export type Image = {
  type: ValueOf<typeof IMAGE_TYPE>;
  name: string;
  src: string;
};

type ImageFormItemProps = {
  image: Image;
  handleImageDelete: (image: Image) => void;
  size?: number;
};

export default function ImageFormItem({
  image,
  handleImageDelete,
  size = 120,
}: ImageFormItemProps) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
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
