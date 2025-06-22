import { useCreatePostMutation, useUploadPostImageMutation } from '../api/mutations';

export interface CreatePostData {
  title: string;
  content: string;
  isPhotoVisibleToDesigner: boolean;
  images: File[];
}

export function useCreatePost() {
  const { mutateAsync: uploadImages } = useUploadPostImageMutation();
  const { mutate: createPostMutate, isPending } = useCreatePostMutation();

  const handleCreatePost = async (data: CreatePostData) => {
    try {
      let imageUrls: string[] = [];

      if (data.images.length > 0) {
        const uploadResult = await uploadImages(data.images);
        imageUrls = uploadResult.data.dataList.map((img) => img.imageURL);
      }

      createPostMutate({
        title: data.title,
        content: data.content,
        isPhotoVisibleToDesigner: data.isPhotoVisibleToDesigner,
        hairConsultPostingImages: imageUrls,
      });
    } catch (error) {
      console.error('게시글 생성 중 오류:', error);
    }
  };

  return {
    handleCreatePost,
    isPending,
  };
}
