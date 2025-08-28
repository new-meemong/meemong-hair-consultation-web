import PostDetailItem from '../../features/posts/ui/post-detail/post-detail-item';

type PostDetailContainerProps = {
  children: React.ReactNode;
};

export const PostDetailContainer = ({ children }: PostDetailContainerProps) => {
  return (
    <div className="flex flex-col flex-1 h-full relative">
      <div className="flex-1 overflow-y-auto">
        <PostDetailItem />
        {children}
      </div>
    </div>
  );
};
