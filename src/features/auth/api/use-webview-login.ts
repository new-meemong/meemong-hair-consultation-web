import { useMutation } from '@tanstack/react-query';

import type { User } from '@/entities/user/model/user';
import { apiClient } from '@/shared/api/client';

const WEBVIEW_API_KEY = process.env.NEXT_PUBLIC_WEBVIEW_API_KEY;

type LoginRequest = {
  userId: string;
};

export function useWebviewLogin({
  onSuccess,
}: { onSuccess?: (response: { data: User }) => void } = {}) {
  return useMutation({
    mutationFn: ({ userId }: LoginRequest) =>
      apiClient.post<User>('auth/webview-login', {
        userId,
        webviewAPIKey: WEBVIEW_API_KEY,
      }),
    onSuccess,
  });
}
