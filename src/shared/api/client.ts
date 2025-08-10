import type { SearchParamsOption, HTTPError } from 'ky';
import ky from 'ky';

import { getToken } from '../lib/auth';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  httpCode: number;
}

const createApiInstance = () => {
  return ky.create({
    prefixUrl: `${API_BASE_URL}/api/v1`,
    hooks: {
      beforeRequest: [
        (request) => {
          const token = getToken();

          if (!token) return;

          request.headers.set('Authorization', `${token}`);
        },
      ],
      beforeError: [
        async (error: HTTPError) => {
          const { response } = error;
          if (response && response.body) {
            try {
              const errorData = (await response.json()) as { error: ApiError };
              error.message = errorData.error.message;

              Object.defineProperty(error, 'response', {
                value: Object.assign(response, {
                  data: errorData,
                }),
                enumerable: true,
                configurable: true,
              });

              return error;
            } catch (parseError) {
              console.error('Error parsing API error response:', parseError);
              return error;
            }
          }
          return error;
        },
      ],
    },
    timeout: 30000,
  });
};

export class ApiClient {
  private api = createApiInstance();

  async get<T>(
    endpoint: string,
    { searchParams }: { searchParams?: SearchParamsOption } = {},
  ): Promise<ApiResponse<T>> {
    return this.api.get(endpoint, { searchParams }).json<ApiResponse<T>>();
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.api.post(endpoint, { json: data }).json<ApiResponse<T>>();
  }

  async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.api.put(endpoint, { json: data }).json<ApiResponse<T>>();
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.api.patch(endpoint, { json: data }).json<ApiResponse<T>>();
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.api.delete(endpoint).json<ApiResponse<T>>();
  }

  // 파일 업로드용 메서드
  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.api
      .post(endpoint, {
        body: formData,
      })
      .json<T>();
  }
}

// 기본 인스턴스는 토큰 없이 생성
export const apiClient = new ApiClient();
