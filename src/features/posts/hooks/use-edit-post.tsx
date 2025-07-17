import usePutPostMutation from '../api/use-put-post-mutation';
import useUploadPostImageMutation from '../api/use-upload-post-image';
import type { PostFormValues } from '../ui/post-form';

export default function useEditPost(postId: string) {
  const { mutateAsync: uploadImages, isPending: isUploadingImages } = useUploadPostImageMutation();
  const { mutate: editPostMutate, isPending: isEditingPost } = usePutPostMutation(postId);

  const editPost = async (data: PostFormValues, { onSuccess }: { onSuccess: () => void }) => {
    try {
      const newImageUrls =
        data.imageFiles.length > 0
          ? (await uploadImages(data.imageFiles)).dataList.map((img) => img.imageURL)
          : [];

      editPostMutate(
        {
          title: data.title,
          content: data.content,
          isPhotoVisibleToDesigner: data.isPhotoVisibleToDesigner,
          hairConsultPostingImages: [...data.imageUrls, ...newImageUrls],
        },
        {
          onSuccess,
        },
      );
    } catch (error) {
      console.error('게시글 수정 중 오류:', error);
    }
  };

  return {
    editPost,
    isPending: isUploadingImages || isEditingPost,
  };
}
