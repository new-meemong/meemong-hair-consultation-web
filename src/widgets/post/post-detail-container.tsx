import PostDetailItem from '../../features/posts/ui/post-detail/post-detail-item';

type PostDetailContainerProps = {
  children: React.ReactNode;
};

export const PostDetailContainer = ({ children }: PostDetailContainerProps) => {
  return (
    <div className="flex flex-col flex-1 h-full relative overflow-x-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden touch-pan-y">
        <PostDetailItem />
        {children}
      </div>
    </div>
  );
};
