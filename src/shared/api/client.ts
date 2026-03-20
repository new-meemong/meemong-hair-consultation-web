import type { HTTPError, SearchParamsOption } from 'ky';
import { getToken, removeUserData } from '../lib/auth';

import ky from 'ky';

export const AUTH_TOKEN_EXPIRED_EVENT = 'auth:token-expired';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiListResponse<T extends Record<string, unknown>> {
  dataList: T[];
  dataCount: number;
  __nextCursor?: string;
}

export interface ApiError {
  code: string;
  message: string;
  httpCode: number;
  fieldErrors?: Array<{
    field: string;
    message?: string;
    reason?: string;
    value?: unknown;
  }>;
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
          request.headers.set('platform', 'HAIR_CONSULTING_WEB');
          request.headers.set('web-version', '1.1.1');
        },
        // Request 로깅
        (request) => {
          console.group('🚀 API Request');
          console.log('URL:', request.url);
          console.log('Method:', request.method);
          console.log('Headers:', Object.fromEntries(request.headers.entries()));

          // Query parameters 로깅
          const url = new URL(request.url);
          if (url.searchParams.toString()) {
            console.log('Query Params:', Object.fromEntries(url.searchParams.entries()));
          }

          // Body 로깅 (POST, PUT, PATCH 요청의 경우)
          if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
            request
              .clone()
              .text()
              .then((body) => {
                if (body) {
                  try {
                    const parsedBody = JSON.parse(body);
                    console.log('Request Body:', parsedBody);
                  } catch {
                    console.log('Request Body (raw):', body);
                  }
                }
              })
              .catch(() => {
                console.log('Request Body: [Unable to read]');
              });
          }
          console.groupEnd();
        },
      ],
      afterResponse: [
        // Response 로깅
        async (request, options, response) => {
          console.group('✅ API Response');
          console.log('URL:', request.url);
          console.log('Method:', request.method);
          console.log('Status:', response.status, response.statusText);
          console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

          // Response body 로깅
          try {
            const responseClone = response.clone();
            const body = await responseClone.text();
            if (body) {
              try {
                const parsedBody = JSON.parse(body);
                console.log('Response Body:', parsedBody);
              } catch {
                console.log('Response Body (raw):', body);
              }
            }
          } catch (error) {
            console.log('Response Body: [Unable to read]', error);
          }
          console.groupEnd();

          return response;
        },
      ],
      beforeError: [
        async (error: HTTPError) => {
          const { response } = error;

          // Error 로깅
          console.group('❌ API Error');
          console.log('URL:', error.request?.url);
          console.log('Method:', error.request?.method);
          console.log('Status:', response?.status, response?.statusText);
          console.log('Error Message:', error.message);

          if (response?.status === 403 && typeof window !== 'undefined') {
            removeUserData();
            window.dispatchEvent(new CustomEvent(AUTH_TOKEN_EXPIRED_EVENT));
          }

          if (response && response.body) {
            try {
              const errorData = (await response.json()) as { error: ApiError };
              console.log('Error Response Body:', errorData);
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
          console.groupEnd();
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
    { searchParams, json }: { searchParams?: SearchParamsOption; json?: unknown } = {},
  ): Promise<ApiResponse<T>> {
    return this.api.get(endpoint, { searchParams, json }).json<ApiResponse<T>>();
  }

  async getList<T extends Record<string, unknown>>(
    endpoint: string,
    { searchParams }: { searchParams?: SearchParamsOption } = {},
  ): Promise<ApiListResponse<T>> {
    return this.api.get(endpoint, { searchParams }).json<ApiListResponse<T>>();
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

// 토큰 없이 요청하는 클라이언트 (웹뷰 로그인 등에 사용)
const createApiInstanceWithoutAuth = () => {
  return ky.create({
    prefixUrl: `${API_BASE_URL}/api/v1`,
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set('platform', 'HAIR_CONSULTING_WEB');
          request.headers.set('web-version', '1.1.1');
        },
        // Request 로깅
        (request) => {
          console.group('🚀 API Request (No Auth)');
          console.log('URL:', request.url);
          console.log('Method:', request.method);
          console.log('Headers:', Object.fromEntries(request.headers.entries()));

          // Query parameters 로깅
          const url = new URL(request.url);
          if (url.searchParams.toString()) {
            console.log('Query Params:', Object.fromEntries(url.searchParams.entries()));
          }

          // Body 로깅 (POST, PUT, PATCH 요청의 경우)
          if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
            request
              .clone()
              .text()
              .then((body) => {
                if (body) {
                  try {
                    const parsedBody = JSON.parse(body);
                    console.log('Request Body:', parsedBody);
                  } catch {
                    console.log('Request Body (raw):', body);
                  }
                }
              })
              .catch(() => {
                console.log('Request Body: [Unable to read]');
              });
          }
          console.groupEnd();
        },
      ],
      afterResponse: [
        // Response 로깅
        async (request, options, response) => {
          console.group('✅ API Response (No Auth)');
          console.log('URL:', request.url);
          console.log('Method:', request.method);
          console.log('Status:', response.status, response.statusText);
          console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

          // Response body 로깅
          try {
            const responseClone = response.clone();
            const body = await responseClone.text();
            if (body) {
              try {
                const parsedBody = JSON.parse(body);
                console.log('Response Body:', parsedBody);
              } catch {
                console.log('Response Body (raw):', body);
              }
            }
          } catch (error) {
            console.log('Response Body: [Unable to read]', error);
          }
          console.groupEnd();

          return response;
        },
      ],
      beforeError: [
        async (error: HTTPError) => {
          const { response } = error;

          // Error 로깅
          console.group('❌ API Error (No Auth)');
          console.log('URL:', error.request?.url);
          console.log('Method:', error.request?.method);
          console.log('Status:', response?.status, response?.statusText);
          console.log('Error Message:', error.message);

          if (response && response.body) {
            try {
              const errorData = (await response.json()) as { error: ApiError };
              console.log('Error Response Body:', errorData);
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
          console.groupEnd();
          return error;
        },
      ],
    },
    timeout: 30000,
  });
};

export class ApiClientWithoutAuth {
  private api = createApiInstanceWithoutAuth();

  async get<T>(
    endpoint: string,
    { searchParams }: { searchParams?: SearchParamsOption } = {},
  ): Promise<ApiResponse<T>> {
    return this.api.get(endpoint, { searchParams }).json<ApiResponse<T>>();
  }

  async getList<T extends Record<string, unknown>>(
    endpoint: string,
    { searchParams }: { searchParams?: SearchParamsOption } = {},
  ): Promise<ApiListResponse<T>> {
    return this.api.get(endpoint, { searchParams }).json<ApiListResponse<T>>();
  }

  async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.api.post(endpoint, { json: data }).json<ApiResponse<T>>();
  }
}

// 토큰 없이 요청하는 클라이언트 인스턴스
export const apiClientWithoutAuth = new ApiClientWithoutAuth();
