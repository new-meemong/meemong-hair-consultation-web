import { useAuthContext } from '@/features/auth/context/auth-context';
import { getUserReadingHistoryData, updateUserReadingHistoryData } from '@/shared';

export default function useReadingPostHistory(postId: number) {
  const { isUserDesigner } = useAuthContext();

  const userReadingHistoryData = getUserReadingHistoryData();

  const isReadingPost = isUserDesigner ? userReadingHistoryData.includes(postId) : false;

  const addReadingPostHistory = () => {
    if (isReadingPost) return;
    updateUserReadingHistoryData(postId);
  };

  return { addReadingPostHistory, isReadingPost };
}
