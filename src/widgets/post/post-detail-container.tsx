import type { PostDetail } from '@/entities/posts/model/post-detail';
import PostDetailItem from '../../features/posts/ui/post-detail-item';

type PostDetailContainerProps = {
  postDetail: PostDetail;
  children: React.ReactNode;
};

export const PostDetailContainer = ({ postDetail, children }: PostDetailContainerProps) => {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <PostDetailItem postDetail={postDetail} />
        {children}
      </div>
    </div>
  );
};
