import type { User } from '@/entities/user/model/user';
import { apiClient } from '@/shared/api/client';
import { useMutation } from '@tanstack/react-query';

const WEBVIEW_API_KEY = process.env.NEXT_PUBLIC_WEBVIEW_API_KEY;

type LoginRequest = {
  userId: string;
};

export const getUser = async (userId: string) => {
  const response = await apiClient.post<User>('auth/webview-login', {
    userId,
    webviewAPIKey: WEBVIEW_API_KEY,
  });
  return response;
};

export function useWebviewLogin({
  onSuccess,
}: { onSuccess?: (response: { data: User }) => void } = {}) {
  return useMutation({
    mutationFn: ({ userId }: LoginRequest) => getUser(userId),
    onSuccess,
  });
}
