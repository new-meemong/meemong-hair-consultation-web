import { XIcon } from 'lucide-react';
import NextImage from 'next/image';

import { Button } from '@/shared';
import { IMAGE_TYPE } from '@/shared/constants/image-type';
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
  const isFilePreview = image.type === IMAGE_TYPE.FILE;

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {isFilePreview ? (
        // eslint-disable-next-line @next/next/no-img-element -- Blob previews need native eager painting in Android WebViews.
        <img
          src={image.src}
          alt={`업로드 이미지 ${image.name}`}
          className="h-full w-full rounded-md object-cover"
          loading="eager"
          decoding="sync"
          draggable={false}
        />
      ) : (
        <NextImage
          src={image.src}
          alt={`업로드 이미지 ${image.name}`}
          fill
          className="object-cover rounded-md"
          sizes={`${size}px`}
        />
      )}
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
