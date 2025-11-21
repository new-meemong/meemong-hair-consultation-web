import useShowLeaveCreateGeneralPostModal from '@/features/posts/hooks/use-show-leave-create-general-post-modal';
import PostForm from '@/features/posts/ui/post-form/post-form';

import { SiteHeader } from '@/widgets/header';

export default function PostFormContainer() {
  const showLeaveCreateGeneralPostModal = useShowLeaveCreateGeneralPostModal();

  const handleBackClick = () => {
    showLeaveCreateGeneralPostModal();
  };

  return (
    <>
      <SiteHeader title="일반글 작성" showBackButton onBackClick={handleBackClick} />
      <PostForm />
    </>
  );
}
