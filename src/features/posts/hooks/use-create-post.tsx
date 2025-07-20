import useCreatePostMutation from '../api/use-create-post-mutation';
import useUploadPostImageMutation from '../api/use-upload-post-image';
import type { PostFormValues } from '../types/post-form-values';

export function useCreatePost() {
  const { mutateAsync: uploadImages, isPending: isUploadingImages } = useUploadPostImageMutation();
  const { mutate: createPostMutate, isPending: isCreatingPost } = useCreatePostMutation();

  const handleCreatePost = async (
    data: PostFormValues,
    { onSuccess }: { onSuccess: () => void },
  ) => {
    try {
      let imageUrls: string[] = [];

      if (data.imageFiles.length > 0) {
        const uploadResult = await uploadImages(data.imageFiles);
        imageUrls = uploadResult.dataList.map((img) => img.imageURL);
      }

      createPostMutate(
        {
          title: data.title,
          content: data.content,
          isPhotoVisibleToDesigner: data.isPhotoVisibleToDesigner,
          hairConsultPostingImages: imageUrls,
        },
        {
          onSuccess,
        },
      );
    } catch (error) {
      console.error('게시글 생성 중 오류:', error);
    }
  };

  return {
    handleCreatePost,
    isPending: isUploadingImages || isCreatingPost,
  };
}
