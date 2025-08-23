import { USER_WRITING_CONTENT_KEYS } from '@/shared/constants/local-storage';
import useWritingContent from '@/shared/hooks/use-writing-content';

export default function useWritingConsultingResponse(postId: string) {
  const { savedContent, saveContent } = useWritingContent(
    USER_WRITING_CONTENT_KEYS.consultingResponse,
  );

  const hasSavedContent = savedContent?.some((content) => content?.content.postId === postId);

  return { hasSavedContent, saveContent, savedContent };
}
