'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';


import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import { POST_FORM_FIELD_NAME } from '@/features/posts/constants/post-form-field-name';
import PostForm from '@/features/posts/ui/post-form/post-form';
import { SiteHeader } from '@/widgets/header';

export default function EditPostPage() {
  const [initialHeight] = useState(() => window.innerHeight);

  const { id: postId } = useParams();

  const { data: response } = useGetPostDetail(postId?.toString() ?? '');
  const postDetail = response?.data;

  if (!postDetail) return null;

  const initialData = {
    [POST_FORM_FIELD_NAME.title]: postDetail.title,
    [POST_FORM_FIELD_NAME.content]: postDetail.content,
    [POST_FORM_FIELD_NAME.isPhotoVisibleToDesigner]: postDetail.isPhotoVisibleToDesigner,
    [POST_FORM_FIELD_NAME.imageUrls]: postDetail.images ?? [],
    [POST_FORM_FIELD_NAME.imageFiles]: [],
  };

  return (
    <div className="h-screen min-h-0 bg-white flex flex-col" style={{ minHeight: initialHeight }}>
      <SiteHeader title="게시글 수정" showBackButton />
      <PostForm initialData={initialData} postId={postDetail.id} />
    </div>
  );
}
