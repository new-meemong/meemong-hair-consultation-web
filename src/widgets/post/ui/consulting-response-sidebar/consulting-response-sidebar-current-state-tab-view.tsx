import Image from 'next/image';

import { isValidUrl } from '@/shared/lib/is-valid-url';

type ConsultingResponseSidebarCurrentStateTabViewProps = {
  images: string[];
};

export default function ConsultingResponseSidebarCurrentStateTabView({
  images,
}: ConsultingResponseSidebarCurrentStateTabViewProps) {
  return (
    <div className="flex flex-col gap-3 pb-8">
      {images.map((image, index) =>
        isValidUrl(image) ? (
          <Image
            key={`${image}-${index}`}
            src={image}
            alt="내 현재 머리 상태"
            className="size-62 object-cover"
            width={248}
            height={248}
          />
        ) : null,
      )}
    </div>
  );
}
