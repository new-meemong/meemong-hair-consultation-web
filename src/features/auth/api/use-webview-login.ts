import type { MyBrand } from '@/entities/brands/model/my-brand';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import type { User } from '@/entities/user/model/user';
import { apiClientWithoutAuth } from '@/shared/api/client';
import { getMyBrand } from '@/entities/brands/api/get-my-brand';
import { useMutation } from '@tanstack/react-query';

const WEBVIEW_API_KEY = process.env.NEXT_PUBLIC_WEBVIEW_API_KEY;

type LoginRequest = {
  userId: string;
};

type WebviewLoginUser = User & {
  brand?: MyBrand | null;
  brandLookupFailed?: boolean;
};

export function useWebviewLogin({
  onSuccess,
  onSettled,
}: {
  onSuccess?: (response: { data: WebviewLoginUser }) => void;
  onSettled?: () => void;
} = {}) {
  return useMutation({
    mutationFn: async ({ userId }: LoginRequest) => {
      const loginResponse = await apiClientWithoutAuth.post<User>('auth/webview-login', {
        userId,
        webviewAPIKey: WEBVIEW_API_KEY,
      });

      let brand: MyBrand | null | undefined =
        loginResponse.data.role === USER_ROLE.DESIGNER ? undefined : null;
      let brandLookupFailed = false;

      if (loginResponse.data.token && loginResponse.data.role === USER_ROLE.DESIGNER) {
        try {
          brand = await getMyBrand(loginResponse.data.token);
        } catch (error) {
          brandLookupFailed = true;
          console.error('내 브랜드 조회 실패:', error);
        }
      }

      return {
        ...loginResponse,
        data: {
          ...loginResponse.data,
          brand,
          brandLookupFailed,
        },
      };
    },
    onSuccess,
    onSettled,
  });
}
