import PostDetailImage from '@/features/posts/ui/post-detail/post-detail-image';
import { isValidUrl } from '@/shared/lib/is-valid-url';

import ConsultingResponseSidebarItem from './consulting-response-sidebar-item';

type ConsultingResponseSidebarDesiredStyleTabViewProps = {
  description: string | null;
  images: string[];
};

export default function ConsultingResponseSidebarDesiredStyleTabView({
  description,
  images,
}: ConsultingResponseSidebarDesiredStyleTabViewProps) {
  const validImages = images.filter((image) => isValidUrl(image));

  if (!description && validImages.length === 0) {
    return <p className="typo-body-2-regular text-label-sub">-</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {validImages.length > 0 && (
        <ConsultingResponseSidebarItem label="원하는 이미지">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {validImages.map((image, index) => (
              <PostDetailImage
                key={`${image}-${index}`}
                images={validImages}
                currentIndex={index}
                size="small"
              />
            ))}
          </div>
        </ConsultingResponseSidebarItem>
      )}
      {description && (
        <ConsultingResponseSidebarItem label="내용">
          <p className="typo-body-2-long-regular text-label-info whitespace-pre-line">
            {description}
          </p>
        </ConsultingResponseSidebarItem>
      )}
    </div>
  );
}
