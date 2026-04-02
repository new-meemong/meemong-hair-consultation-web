import PostDetailItem from '../../features/posts/ui/post-detail/post-detail-item';
import { cn } from '@/shared/lib/utils';

type PostDetailContainerProps = {
  children?: React.ReactNode;
  topContent?: React.ReactNode;
  hideAuthorProfile?: boolean;
  isWriter?: boolean;
  compactTitleSpacing?: boolean;
  hideTopAdvisor?: boolean;
  className?: string;
};

export const PostDetailContainer = ({
  children,
  topContent,
  hideAuthorProfile,
  isWriter,
  compactTitleSpacing,
  hideTopAdvisor,
  className,
}: PostDetailContainerProps) => {
  return (
    <div className={cn('flex flex-col flex-1 h-full relative overflow-x-hidden', className)}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y">
        {topContent}
        <PostDetailItem
          hideAuthorProfile={hideAuthorProfile}
          isWriter={isWriter}
          compactTitleSpacing={compactTitleSpacing}
          hideTopAdvisor={hideTopAdvisor}
        />
        {children}
      </div>
    </div>
  );
};
