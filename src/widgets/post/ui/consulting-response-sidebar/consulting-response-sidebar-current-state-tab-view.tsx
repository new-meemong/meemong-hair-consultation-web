import PostDetailImage from '@/features/posts/ui/post-detail/post-detail-image';
import { isValidUrl } from '@/shared/lib/is-valid-url';

type ConsultingResponseSidebarCurrentStateTabViewProps = {
  referenceImages: string[];
  profileImages: string[];
};

function ImageList({ images }: { images: string[] }) {
  const validImages = images.filter((image) => isValidUrl(image));

  if (validImages.length === 0) {
    return <p className="typo-body-2-regular text-label-sub">-</p>;
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {validImages.map((image, index) => (
        <PostDetailImage
          key={`${image}-${index}`}
          images={validImages}
          currentIndex={index}
          size="large"
        />
      ))}
    </div>
  );
}

export default function ConsultingResponseSidebarCurrentStateTabView({
  referenceImages,
  profileImages,
}: ConsultingResponseSidebarCurrentStateTabViewProps) {
  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="typo-body-1-semibold text-label-default">참고 사진</p>
        <p className="mt-1 typo-body-2-long-regular text-label-info">
          첫번째 사진은 최근 7일 내 사진입니다
        </p>
        <div className="mt-3">
          <ImageList images={referenceImages} />
        </div>
      </div>
      <div>
        <p className="typo-body-1-semibold text-label-default">프로필사진</p>
        <div className="mt-3">
          <ImageList images={profileImages} />
        </div>
      </div>
    </div>
  );
}
