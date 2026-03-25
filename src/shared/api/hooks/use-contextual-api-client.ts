import { apiClient, type ApiListResponse, type ApiResponse } from '@/shared/api/client';
import { useOptionalBrand } from '@/shared/context/brand-context';
import { getWebUserData } from '@/shared/lib/auth';
import { createWebApiClient } from '@/shared/lib/web-api';

export interface IApiClient {
  get<T>(endpoint: string, options?: { searchParams?: URLSearchParams }): Promise<ApiResponse<T>>;
  getList<T extends Record<string, unknown>>(
    endpoint: string,
    options?: { searchParams?: URLSearchParams },
  ): Promise<ApiListResponse<T>>;
  post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>>;
  patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}

// 토큰 없을 때 WebSessionGuard가 리다이렉트하는 동안 로딩 상태를 유지하는 스텁
const pendingClient: IApiClient = {
  get: () => new Promise(() => {}),
  getList: () => new Promise(() => {}),
  post: () => new Promise(() => {}),
  patch: () => new Promise(() => {}),
  delete: () => new Promise(() => {}),
};

export function useContextualApiClient(): IApiClient {
  const brand = useOptionalBrand();

  if (brand) {
    const { slug } = brand.config;
    const webToken = getWebUserData(slug)?.token;
    if (!webToken) {
      // 토큰 없음: WebSessionGuard가 welcome 페이지로 리다이렉트 처리
      return pendingClient;
    }
    const webClient = createWebApiClient(webToken, slug);
    return {
      async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        const data = await webClient.get<T>(endpoint);
        return { data, success: true };
      },
      async getList<T extends Record<string, unknown>>(
        endpoint: string,
        options?: { searchParams?: URLSearchParams },
      ): Promise<ApiListResponse<T>> {
        return webClient.getList<T>(endpoint, options);
      },
      async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        const result = await webClient.post<T>(endpoint, data);
        return { data: result, success: true };
      },
      async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        await webClient.patch(endpoint, data);
        return { data: undefined as unknown as T, success: true };
      },
      async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        await webClient.delete(endpoint);
        return { data: undefined as unknown as T, success: true };
      },
    };
  }

  return apiClient as unknown as IApiClient;
}
