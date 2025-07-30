'use client';

import { useAuthContext } from '@/features/auth/context/auth-context';
import { CommentContainer } from '@/widgets/comments/ui/comment-container';
import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import { PostDetailContainer } from '@/widgets/post/post-detail-container';
import PostDetailMoreButton from '@/features/posts/ui/post-detail-more-button';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import useGuidePopup from '@/shared/hooks/use-guide-popup';
import { SiteHeader } from '@/widgets/header';
import { useParams } from 'next/navigation';

export default function PostDetailPage() {
  const { isUserDesigner, user } = useAuthContext();
  const { id: postId } = useParams();

  useGuidePopup(USER_GUIDE_KEYS.hasSeenDesignerOnboardingGuide, { shouldShow: isUserDesigner });

  const { data: response } = useGetPostDetail(postId?.toString() ?? '');
  const postDetail = response?.data;

  const isWriter = postDetail?.hairConsultPostingCreateUserId === user.id;

  if (!postId) return null;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <SiteHeader
        title="헤어상담"
        showBackButton
        rightComponent={isWriter && <PostDetailMoreButton postId={postId.toString()} />}
      />
      <div className="flex-1 overflow-y-auto">
        {postDetail && (
          <PostDetailContainer postDetail={postDetail}>
            <CommentContainer postId={postId.toString()} />
          </PostDetailContainer>
        )}
      </div>
    </div>
  );
}
