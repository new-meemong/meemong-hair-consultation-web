import { useMutation } from '@tanstack/react-query';

export default function useDeletePost() {
  const { mutate: deletePost, isPending } = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
  });

  return { deletePost, isPending };
}
