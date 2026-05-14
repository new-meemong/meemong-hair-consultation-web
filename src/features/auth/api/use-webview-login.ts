import type { MyBrand } from '@/entities/brands/model/my-brand';
import type { User } from '@/entities/user/model/user';
import { apiClientWithoutAuth } from '@/shared/api/client';
import { getMyBrand } from '@/entities/brands/api/get-my-brand';
import { isDesigner, normalizeUserRole } from '@/entities/user/lib/user-role';
import { useMutation } from '@tanstack/react-query';

const WEBVIEW_API_KEY = process.env.NEXT_PUBLIC_WEBVIEW_API_KEY;

type LoginRequest = {
  userId: string;
};

type WebviewLoginUser = User & {
  brand?: MyBrand | null;
  brandLookupFailed?: boolean;
};

type WebviewLoginResponseUser = Omit<User, 'role'> & {
  role?: User['role'];
};

function normalizeWebviewLoginUser(user: WebviewLoginResponseUser): User {
  const normalizedUser = normalizeUserRole(user);
  if (normalizedUser.role === undefined) {
    console.error('webview-login 응답에 role/Role이 없습니다.', { userId: user.id });
    return normalizedUser as User;
  }

  return {
    ...normalizedUser,
    role: normalizedUser.role,
  };
}

export function useWebviewLogin({
  onSuccess,
  onSettled,
}: {
  onSuccess?: (response: { data: WebviewLoginUser }) => void;
  onSettled?: () => void;
} = {}) {
  return useMutation({
    mutationFn: async ({ userId }: LoginRequest) => {
      const loginResponse = await apiClientWithoutAuth.post<WebviewLoginResponseUser>(
        'auth/webview-login',
        {
          userId,
          webviewAPIKey: WEBVIEW_API_KEY,
        },
      );
      const loginUser = normalizeWebviewLoginUser(loginResponse.data);

      const isLoginUserDesigner = isDesigner(loginUser);
      let brand: MyBrand | null | undefined = isLoginUserDesigner ? undefined : null;
      let brandLookupFailed = false;

      if (loginUser.token && isLoginUserDesigner) {
        try {
          brand = await getMyBrand(loginUser.token);
        } catch (error) {
          brandLookupFailed = true;
          console.error('내 브랜드 조회 실패:', error);
        }
      }

      return {
        ...loginResponse,
        data: {
          ...loginUser,
          brand,
          brandLookupFailed,
        },
      };
    },
    onSuccess,
    onSettled,
  });
}
