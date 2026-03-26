import { API_BASE_URL, AUTH_TOKEN_EXPIRED_EVENT, type ApiListResponse } from '@/shared/api/client';
import { WEB_USER_DATA_KEY } from '@/shared/constants/local-storage';
import ky from 'ky';

/**
 * web_user_data token 기반 인증 API 클라이언트 팩토리
 * Phase 3 WebAuthProvider 도입 전까지 사용
 */
export function createWebApiClient(token: string, slug?: string) {
  const api = ky.create({
    prefixUrl: `${API_BASE_URL}/api/v1`,
    headers: {
      Authorization: token,
      platform: 'HAIR_CONSULTING_WEB',
      'web-version': '1.1.1',
    },
    timeout: 30000,
    hooks: {
      beforeError: [
        async (error) => {
          const { response } = error;

          if (response?.status === 403 && typeof window !== 'undefined' && slug) {
            localStorage.removeItem(WEB_USER_DATA_KEY(slug));
            window.dispatchEvent(new CustomEvent(AUTH_TOKEN_EXPIRED_EVENT));
          }

          return error;
        },
      ],
    },
  });

  return {
    async get<T>(
      endpoint: string,
      options?: { searchParams?: Record<string, string | number | boolean | string[] | number[]> },
    ): Promise<T> {
      let searchParams: URLSearchParams | undefined;
      if (options?.searchParams) {
        searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(options.searchParams)) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams!.append(key, String(v)));
          } else {
            searchParams.set(key, String(value));
          }
        }
      }
      const res = await api.get(endpoint, { searchParams }).json<{ data: T }>();
      return res.data;
    },
    async getList<T extends Record<string, unknown>>(
      endpoint: string,
      options?: { searchParams?: URLSearchParams },
    ): Promise<ApiListResponse<T>> {
      return api.get(endpoint, { searchParams: options?.searchParams }).json<ApiListResponse<T>>();
    },
    async getRaw<T>(
      endpoint: string,
      options?: { searchParams?: Record<string, string | number | boolean | string[] | number[]> },
    ): Promise<T> {
      let searchParams: URLSearchParams | undefined;
      if (options?.searchParams) {
        searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(options.searchParams)) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams!.append(key, String(v)));
          } else {
            searchParams.set(key, String(value));
          }
        }
      }
      return api.get(endpoint, { searchParams }).json<T>();
    },
    async post<T>(endpoint: string, data: unknown): Promise<T> {
      const res = await api.post(endpoint, { json: data }).json<{ data: T }>();
      return res.data;
    },
    async patch(endpoint: string, data: unknown): Promise<void> {
      await api.patch(endpoint, { json: data });
    },
    async delete(endpoint: string): Promise<void> {
      await api.delete(endpoint);
    },
  };
}
