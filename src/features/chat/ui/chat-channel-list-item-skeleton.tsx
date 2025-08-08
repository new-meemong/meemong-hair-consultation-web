import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type ChatChannelListItemSkeletonProps = {
  count?: number;
};

export default function ChatChannelListItemSkeleton({
  count = 1,
}: ChatChannelListItemSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4 px-6 py-4 bg-white">
          {/* 프로필 이미지 스켈레톤 */}
          <div className="size-15 rounded-4 overflow-hidden">
            <Skeleton width={60} height={60} borderRadius={4} containerClassName="h-15" />
          </div>

          {/* 메시지 내용 스켈레톤 */}
          <div className="flex flex-col gap-2">
            <Skeleton height={18} width={181} borderRadius={4} containerClassName="h-4.5" />
            <div className="flex flex-col gap-1">
              <Skeleton height={12} width={156} borderRadius={4} containerClassName="h-3" />
              <Skeleton height={12} width={90} borderRadius={4} containerClassName="h-3" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
